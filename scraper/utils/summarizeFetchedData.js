const summarizeFetchedData = async (courses) => {
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
        const semesterId = course.content.cpCourseDto.id;
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
          semesterId,
        };
    });
};

export {summarizeFetchedData};