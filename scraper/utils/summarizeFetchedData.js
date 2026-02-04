const summarizeFetchedData = async (courses) => {
    return courses.map((course) => {
        // New API structure: data is directly on course object, not nested in content.cpCourseDto
        // Try new structure first, fall back to old for backwards compatibility
        const courseData = course.content?.cpCourseDto || course;
        
        const courseId = courseData.id;

        // Handle courseTitle - new structure has translations.translation array
        let courseTitle;
        if (courseData.courseTitle?.translations?.translation) {
            const translations = courseData.courseTitle.translations.translation;
            const englishTitle = translations.find(el => el.lang === 'en')?.value;
            const germanTitle = translations.find(el => el.lang === 'de')?.value;
            courseTitle = englishTitle || germanTitle || courseData.courseTitle?.value || '-';
        } else {
            courseTitle = courseData.courseTitle?.value || '-';
        }

        // Handle semester
        const semester = courseData.semesterDto?.shortName?.value 
            ? [courseData.semesterDto.shortName.value] 
            : (courseData.semesterDto?.shortName?.coType === 'model-core.lib.model.langdata'
                ? [courseData.semesterDto.shortName.value]
                : []);
        const semesterId = courseData.semesterDto?.id || courseId;
        
        const mainLecturers = [];
        const otherLecturers = [];

        // Handle lectureships
        if (courseData.lectureships && Array.isArray(courseData.lectureships)) {
            courseData.lectureships.forEach((lecturer, index) => {
                const identityLib = lecturer.identityLibDto || lecturer;
                const firstName = identityLib.firstName;
                const lastName = identityLib.lastName;
                const lecturerName = `${firstName} ${lastName}`;
                const lecturerInfo = {
                    name: lecturerName,
                    businessCardLink: identityLib.businessCardLink
                        ? (identityLib.businessCardLink.href || identityLib.businessCardLink)
                        : null,
                };
                if (
                    lecturer.teachingFunction?.key === "L" ||
                    (index === 0 && mainLecturers.length === 0)
                ) {
                    mainLecturers.push(lecturerInfo);
                } else {
                    otherLecturers.push(lecturerInfo);
                }
            });
        }

        // Handle courseNumber - new structure has databaseValue
        const courseNumber = courseData.courseNumber?.databaseValue 
            || courseData.courseNumber?.courseNumber 
            || courseData.courseNumber;

        return {
            courseId,
            courseNumber,
            courseTitle,
            mainLecturers,
            otherLecturers,
            semester,
            semesterId,
        };
    });
};

export {summarizeFetchedData};