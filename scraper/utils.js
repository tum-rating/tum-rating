import axios from "axios";

const baseUrl =
    "https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses";
const queryParams =
    "$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=198&$orderBy=title=ascnf";
const pageSize = 1;
const totalPages = 1;

const fetchPage = async (page) => {
    console.log(`Fetching page ${page}...`);
    const skip = (page - 1) * pageSize;
    const xmlUrl = `${baseUrl}?${queryParams}&$skip=${skip}&$top=${pageSize}`;

    try {
        const response = await axios.get(xmlUrl);
        return response.data.resource;
    } catch (error) {
        console.error("Error fetching XML data:", error);
        return [];
    }
};

const fetchAllPages = async () => {
    const allCourses = [];

    for (let page = 1; page <= totalPages; page++) {
        const pageData = await fetchPage(page);
        allCourses.push(...pageData);
    }

    return allCourses;
};

const summariesFn = async (courses) => {
    return courses.map((course) => {
        const courseId = course.content.cpCourseDto.id;
        const courseTitleTranslations =
            course.content.cpCourseDto.courseTitle.translations.translation.reduce(
                (acc, translation) => {
                    acc[translation.lang] = translation.value;
                    return acc;
                },
                {},
            );

        const semester = course.content.cpCourseDto.semesterDto.shortName.value;
        const mainLecturers = [];
        const otherLecturers = [];

        course.content.cpCourseDto.lectureships.forEach((lecturer, index) => {
            const firstName = lecturer.identityLibDto.firstName;
            const lastName = lecturer.identityLibDto.lastName;
            const lecturerName = `${firstName} ${lastName}`;
            const lecturerInfo = {
                name: lecturerName,
                businessCardLink: lecturer.identityLibDto.businessCardLink
                    ? lecturer.identityLibDto.businessCardLink.href
                    : null,
            };
            if (
                lecturer.teachingFunction.key === "L" ||
                (index === 0 && mainLecturers.length === 0)
            ) {
                mainLecturers.push(lecturerInfo);
            } else {
                otherLecturers.push(lecturerInfo);
            }
        });

        return {
            courseId,
            courseNumber: course.content.cpCourseDto.courseNumber,
            courseTitleTranslations,
            mainLecturers,
            otherLecturers,
            semester,
        };
    });
};

export {fetchAllPages,summariesFn}