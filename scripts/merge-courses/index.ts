import mongoose from 'mongoose';
import * as fs from 'fs';

import { 
    connectMongo,
    createCourse,
    getCourse,
    updateCourse,
    getReviewsForCourse,
    updateReview,
} from './database'

const config = {
    databaseUrl: undefined,
    databaseName: undefined,
    file: 'merge-courses/merged-courses_WITH_CHECKING_CODES.json',
};


async function main() {
    await connectMongo(config.databaseUrl, config.databaseName);
    console.log('Connected to MongoDB');

    const file = fs.readFileSync(config.file, 'utf8');
    const courses = JSON.parse(file);


    for (const [index, course] of courses.entries()) {
        console.log(`Processing course ${index + 1} of ${courses.length}`);

        if (!course.id) {
            console.log(`Course ${index + 1} does not have an ID, name ${course.name}, creating...`);
            const createdCourse = await createCourse({
                professor: course.professor,
                otherLecturers: course.otherLecturers,
                name: course.name,
                courseId: course.courseId,
                courseNumber: course.courseNumber,
                offeredInSemesters: course.offeredInSemesters,

            });
            console.log(`Created new course with ID ${createdCourse.id}`);
            continue;
        }

        const courseFromDb = await getCourse(course.id);

        const newName = course.name;
        const newOfferedInSemesters = course.offeredInSemesters;
        const newCodes = course.codes;

        console.log(`Course id: ${courseFromDb.id} with name "${courseFromDb.name}" and offered in semesters ${courseFromDb.offeredInSemesters} has the following new values:`);

        await updateCourse(courseFromDb.id, {
            offeredInSemesters: newOfferedInSemesters,
        });

        console.log(`Course updated\n`);
    }

    await mongoose.disconnect();
}

main();