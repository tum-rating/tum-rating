import { FetchedData } from "@/types/fetchedData.ts";

export async function fetchData(): Promise<FetchedData> {
    try {
        const [computedCoursesModule, allCoursesMapModule, allCoursesModule] = await Promise.all([
            import('../../temp/computed_courses.json', { assert: { type: 'json' } }),
            import('../../temp/all_courses_map.json', { assert: { type: 'json' } }),
            import('../../temp/all_courses.json', { assert: { type: 'json' } }),
        ]);

        const computedCourses = computedCoursesModule.default as FetchedData['computedCourses'];
        const allCoursesMap = allCoursesMapModule.default as unknown as FetchedData['allCoursesMap'];
        const allCourses = allCoursesModule.default as FetchedData['allCourses'];

        return { computedCourses, allCoursesMap, allCourses };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}