import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    // FILES
    SEMESTERS_DIR: path.join(__dirname, './semesters', 'semesters.json'),
    PROD_DB_COURSES_DIR: path.join(__dirname, './fetchedFromProd', 'courses.json'),
    // URLS
    TUM_ONLINE_SEMESTERS_URL: "https://campus.tum.de/tumonline/ee/rest/slc.lib.tm/semesters/student?$language=",
    // FETCH SETTINGS
};

export default config;