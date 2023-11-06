import axios from 'axios';
import fs from 'fs';


const adminToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOjAsInVzZXJSb2xlIjowLCJzdWIiOiI2NTQ0YWQwM2Q0MTgxNjE4YTg1MzdkYmEiLCJleHAiOjE2OTkwODU5Njd9.MsBqx4hMNGl24H_oA8IAV441TN4atmNqDIHPVheHlDg';
const backendEndpoint = 'http://localhost:3000/api/v1/reviews';
const inputFile = 'output.json';



(async () => {
    if(!adminToken){
        console.error('token is missing');
        return;
    }

    const courses = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    for(let course of courses) {
        const parsedCourseForApi = {};

        parsedCourseForApi.courseId = course.courseId.toString();
        parsedCourseForApi.courseNumber = course.courseNumber.databaseValue;
        parsedCourseForApi.course = course.courseTitleTranslations.en;
        parsedCourseForApi.professor = (course.mainLecturers[0] || {}).name;
        parsedCourseForApi.otherLecturers = [];

        if(course.mainLecturers.length > 1)
            parsedCourseForApi.otherLecturers.push(...course.mainLecturers.slice(1).map(lecturer => lecturer.name))

        if(course.otherLecturers)
            parsedCourseForApi.otherLecturers.push(...course.otherLecturers.map(lecturer => lecturer.name));

        parsedCourseForApi.offeredInSemesters = [course.semester];

        console.log('course: ', parsedCourseForApi);

        try {
            await axios.post(backendEndpoint, parsedCourseForApi, {
                headers: {
                    Authorization: 'Bearer ' + adminToken
                }
            });
        } catch(error) {
            console.error('Request failed: ', error.message, error.response.data);
        }
    }
})();