export async function fetchData() {
    try {
        const [computedCoursesModule, allCoursesMapModule, allCoursesModule] = await Promise.all([
            import('../../temp/computed_courses.json', {assert: {type: 'json'}}),
            import('../../temp/all_courses_map.json', {assert: {type: 'json'}}),
            import('../../temp/all_courses.json', {assert: {type: 'json'}}),
        ]);

        const computedCourses = computedCoursesModule.default;
        const allCoursesMap = allCoursesMapModule.default;
        const allCourses = allCoursesModule.default;

        return {computedCourses, allCoursesMap, allCourses};
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}