import fs from 'fs';
import config from '../../config.js';

const getDbCoursesFiles = () => {
    const fetchedDBCourses = fs.existsSync(config.PROD_DB_COURSES_DIR);
    let fetchedDBCoursesLength = 0;
    let fetchedDBCoursesNotEmpty = false;

    if (fetchedDBCourses) {
        if (fs.lstatSync(config.PROD_DB_COURSES_DIR).isDirectory()) {
            fetchedDBCoursesLength = fs.readdirSync(config.PROD_DB_COURSES_DIR).length;
            fetchedDBCoursesNotEmpty = fetchedDBCoursesLength > 0;
        } else {
            fetchedDBCoursesLength = 1;
            fetchedDBCoursesNotEmpty = true;
        }
    }

    return {
        fetchedDBCourses,
        fetchedDBCoursesLength,
        fetchedDBCoursesNotEmpty
    };
};

export default getDbCoursesFiles;