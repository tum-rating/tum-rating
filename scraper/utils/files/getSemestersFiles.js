import fs from 'fs';
import config from '../../config.js';

const getSemestersFiles = async () => {
    const fetchedSemesters = fs.existsSync(config.SEMESTERS_DIR);
    let fetchedSemestersLength = 0;
    let fetchedSemestersNotEmpty = false;

    if (fetchedSemesters && fs.lstatSync(config.SEMESTERS_DIR).isDirectory()) {
        fetchedSemestersLength = fs.readdirSync(config.SEMESTERS_DIR).length;
        fetchedSemestersNotEmpty = fetchedSemestersLength > 0;
    }

    return {
        fetchedSemesters,
        fetchedSemestersLength,
        fetchedSemestersNotEmpty
    };
};

export default getSemestersFiles;
