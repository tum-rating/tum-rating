import axios from "axios";
import fs from "fs";
import { distance as levenshteinDistance } from "fastest-levenshtein";
import { v4 as uuidv4 } from 'uuid';

const baseUrl = "https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses";

interface FetchOptions {
    pageSize: number;
    termId: string;
    totalPages?: number;
}

interface Course {
    id: string;
    courseTitle: {
        translations: {
            translation: { lang: string; value: string }[];
        };
    };
    semesterDto: {
        shortName: { value: string };
    };
    lectureships: {
        identityLibDto: {
            firstName: string;
            lastName: string;
            businessCardLink?: { href: string };
        };
        teachingFunction: { key: string };
    }[];
    courseNumber: string;
}

interface ParsedCourse {
    courseId: string;
    courseNumber: string;
    name: string;
    professor: string;
    otherLecturers: string[];
    offeredInSemesters: string[];
}

function keySimilarityCore(
    arr: any[],
    key: string,
    identificationKey: string,
    progressCallback?: (progress: number) => void
): any[] {
    const mergedArray: any[] = [];
    const mergedRecords = new Map<number, boolean>();
    const codePattern = /\b([A-Z]{2,}[0-9]+(?:_[0-9]+)?(?:\s+[A-Z]+)?(?:\s+[A-Z]{2})?)\b/g;

    function extractCodes(title: string): Set<string> {
        const codes = new Set<string>();
        let match;
        while ((match = codePattern.exec(title)) !== null) {
            codes.add(match[0]);
        }
        return codes;
    }

    function redundantWordsExtractor(title: string): { cleanedTitle: string; codes: Set<string> } {
        const redundantWords = ["exercise", "seminar", "advanced", "course", "engineering", "english", "german", "research", "master", "exercises", "theory", "practical", "colloquium", "project"];
        const redundantWordsPattern = new RegExp(`\\b(${redundantWords.join("|")})\\b`, "gi");
        const delimitersPattern = /[()\[\],-]/g;
        const cleanedTitle = title.replace(redundantWordsPattern, "").replace(codePattern, "").replace(delimitersPattern, "").trim();
        const codes = extractCodes(title);
        return { cleanedTitle, codes };
    }

    function checkIfCoursesHaveAtLeastOneCommonWord(course1: string, course2: string): boolean {
        const words1 = course1.split(" ").filter(word => word.length > 1);
        const words2 = course2.split(" ").filter(word => word.length > 1);
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length > 0;
    }

    for (let index = 0; index < arr.length; index++) {
        console.log(index + "/" + arr.length);
        const item = arr[index];
        const similarRecords: any[] = [];
        const { cleanedTitle: itemTitle, codes: currentCodes } = redundantWordsExtractor(item[key]);
        const offeredInSemesters = new Set<string>(item.offeredInSemesters);

        if (mergedRecords.has(index)) {
            progressCallback?.(index + 1);
            continue;
        }
        for (let i = index + 1; i < arr.length; i++) {
            if (mergedRecords.has(i)) continue;

            const record = arr[i];
            const { cleanedTitle: recordTitle, codes: recordCodes } = redundantWordsExtractor(record[key]);
            const similarity = levenshteinDistance(itemTitle, recordTitle);

            if (record.rejectedId && record.rejectedId.includes(item["id"])) {
                continue;
            }

            if (similarity < 25 && record.professor === item.professor && checkIfCoursesHaveAtLeastOneCommonWord(itemTitle, recordTitle)) {
                similarRecords.push({
                    ...record,
                    similarity: similarity,
                    codes: Array.from(recordCodes),
                    offeredInSemesters: record.offeredInSemesters,
                });
                recordCodes.forEach(code => currentCodes.add(code));
                record.offeredInSemesters.forEach(semester => offeredInSemesters.add(semester));
                mergedRecords.set(i, true);
            }
        }

        if (similarRecords.length > 0) {
            mergedArray.push({
                name: item[key],
                merged: [{
                    ...item,
                    similarity: 0,
                    codes: Array.from(currentCodes),
                    offeredInSemesters: Array.from(offeredInSemesters),
                }, ...similarRecords],
                codes: Array.from(currentCodes),
                offeredInSemesters: Array.from(offeredInSemesters),
                professor: item.professor,
                courseId: "",
                courseNumber: "",
                id: uuidv4()
            });
        } else {
            mergedArray.push({
                ...item,
                codes: Array.from(currentCodes),
                merged: [],
            });
        }
        progressCallback?.(index + 1);
    }

    return mergedArray;
}

const fetchPage = async (page: number, options: FetchOptions): Promise<Course[]> => {
    const { pageSize, termId } = options;
    const queryParams = `$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf`;
    const skip = (page - 1) * pageSize;
    const xmlUrl = `${baseUrl}?${queryParams}&$skip=${skip}&$top=${pageSize}`;


    try {
        const response = await axios.get(xmlUrl);
        return response.data.courses;
    } catch (error) {
        console.error("Error fetching XML data:", error);
        return [];
    }
};

const fetchPageWithRetry = async (page: number, options: FetchOptions, maxRetries = 10, retryDelay = 5000): Promise<Course[]> => {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            return await fetchPage(page, options);
        } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed: ${error.message}`);
            if (attempts === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    return [];
};

const getNumberOfPages = async ({ pageSize, termId }: FetchOptions): Promise<number> => {
    const url = `https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses?$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf&$skip=0&$top=${pageSize}`;
    const response = await axios.get(url);
    const totalCount = response.data.totalCount;
    return Math.ceil(totalCount / pageSize);
};

const fetchAllPages = async (options: FetchOptions): Promise<Course[]> => {
    const { pageSize, termId } = options;
    const allCourses: Course[] = [];

    const numberOfPages = await getNumberOfPages({ pageSize, termId });

    console.log("dla termid" + termId, "liczba stron", numberOfPages);

    for (let page = 1; page <= numberOfPages; page++) {
        const data = await fetchPageWithRetry(page, options);
        allCourses.push(...data);
    }

    return allCourses;
};

const summarizeFetchedData = async (courses: Course[]): Promise<ParsedCourse[]> => {
    return courses.map((course) => {
        const courseId = course.id;

        const germanTitle = course.courseTitle.translations.translation.find(el => el.lang === 'de')?.value;
        const englishTitle = course.courseTitle.translations.translation.find(el => el.lang === 'en')?.value;
        const courseTitle = englishTitle || germanTitle;

        const semester = [course.semesterDto.shortName.value];
        const semesterId = course.id;
        const mainLecturers: { name: string; businessCardLink: string | null }[] = [];
        const otherLecturers: { name: string; businessCardLink: string | null }[] = [];

        course.lectureships.forEach((lecturer, index) => {
            const firstName = lecturer.identityLibDto.firstName;
            const lastName = lecturer.identityLibDto.lastName;
            const lecturerName = `${firstName} ${lastName}`;
            const lecturerInfo = {
                name: lecturerName,
                businessCardLink: lecturer.identityLibDto.businessCardLink?.href || null,
            };
            if (lecturer.teachingFunction.key === "L" || (index === 0 && mainLecturers.length === 0)) {
                mainLecturers.push(lecturerInfo);
            } else {
                otherLecturers.push(lecturerInfo);
            }
        });

        return parseCourse({
            courseId,
            courseNumber: course.courseNumber,
            courseTitle,
            mainLecturers,
            otherLecturers,
            semester,
            semesterId,
        });
    });
};

const parseCourse = (course: any): ParsedCourse => {
    let parsedCourseForApi: ParsedCourse = {
        courseId: "",
        courseNumber: "",
        name: "",
        professor: "",
        otherLecturers: [],
        offeredInSemesters: []
    };

    parsedCourseForApi.courseId = course.courseId.toString();
    parsedCourseForApi.courseNumber = course.courseNumber.databaseValue;
    parsedCourseForApi.name = course.courseTitle;
    parsedCourseForApi.professor = (course.mainLecturers[0] || {}).name;
    parsedCourseForApi.otherLecturers = [];

    if (course.mainLecturers.length > 1)
        parsedCourseForApi.otherLecturers.push(...course.mainLecturers.slice(1).map(lecturer => lecturer.name));

    if (course.otherLecturers)
        parsedCourseForApi.otherLecturers.push(...course.otherLecturers.map(lecturer => lecturer.name));

    parsedCourseForApi.offeredInSemesters = course.semester;
    return parsedCourseForApi;
}

export { fetchAllPages, summarizeFetchedData, parseCourse,keySimilarityCore };
