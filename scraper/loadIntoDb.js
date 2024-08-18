import axios from 'axios';
import fs from 'fs';


const adminToken = "";
const backendEndpoint = 'http://localhost:3000/api/v1/courses';
const inputFile = './merged/output.json';


(async () => {
    if (!adminToken) {
        console.error('token is missing');
        return;
    }

    const courses = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    for (let course of courses) {
        const parsedCourseForApi = {};

        parsedCourseForApi.courseId = course.courseId.toString();
        parsedCourseForApi.courseNumber = course.courseNumber.databaseValue;
        parsedCourseForApi.name = course.courseTitle;
        parsedCourseForApi.professor = (course.mainLecturers[0] || {}).name;
        parsedCourseForApi.otherLecturers = [];

        if (course.mainLecturers.length > 1)
            parsedCourseForApi.otherLecturers.push(...course.mainLecturers.slice(1).map(lecturer => lecturer.name))

        if (course.otherLecturers)
            parsedCourseForApi.otherLecturers.push(...course.otherLecturers.map(lecturer => lecturer.name));

        parsedCourseForApi.offeredInSemesters = course.semester;

        console.log('course: ', parsedCourseForApi);

        try {
            await axios.post(backendEndpoint, parsedCourseForApi, {
                headers: {
                    Authorization: 'Bearer ' + adminToken
                }
            });
        } catch (error) {
            console.error('Request failed: ', error.message, error.response.data);
        }
    }
})();