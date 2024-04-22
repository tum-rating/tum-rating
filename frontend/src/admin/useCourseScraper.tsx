import {useQuery} from "@tanstack/react-query";

import {endpoints} from "@/api";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

const courseParser = async (course: any) => {
    const courseId = course.content.cpCourseDetailDto.cpCourseDto.id;
    const courseTitleTranslations =
        course.content.cpCourseDetailDto.cpCourseDto.courseTitle.translations.translation.reduce(
            (acc, translation) => {
                acc[translation.lang] = translation.value;
                return acc;
            },
            {},
        );

    const semester = course.content.cpCourseDetailDto.cpCourseDto.semesterDto.shortName.value;
    const mainLecturers = [];
    const otherLecturers = [];

    course.content.cpCourseDetailDto.cpCourseDto.lectureships.forEach((lecturer, index) => {
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
        courseId: String(courseId),
        courseNumber: course.content.cpCourseDetailDto.cpCourseDto.courseNumber.databaseValue,
        name: courseTitleTranslations.en || courseTitleTranslations.de,
        professor: mainLecturers[0].name,
        otherLecturers: otherLecturers.length ? otherLecturers.map(x => x.name) : [],
        offeredInSemesters: [semester],
    };
}


const scrapeCourse = async (idFromURL: string) => {
    const response = await fetch(endpoints.scrapeCourse(idFromURL), {
        headers: {
            'Accept': 'application/json'
        }
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return await courseParser(data.resource[0]);
}

const useCourseScraper = (url:string) => {
    const idFromURL = url.match(/\/courses\/(\d+)/)[1]

    return useQuery({
        queryFn: async () => scrapeCourse(idFromURL),
        queryKey: ['scrapeCourse', idFromURL],
        enabled: false
    })
}

export {useCourseScraper}