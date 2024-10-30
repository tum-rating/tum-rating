import fs from "fs";
import axios from "axios";
import path from "path";
import config from "../config.js";

const fetchAndSaveSemestersList = async () => {
    const url = config.TUM_ONLINE_SEMESTERS_URL
    try {
        const response = await axios.get(url);
        const semesters = response.data.semesters;
        const semesterMap = semesters.reduce((acc, semester) => {
            const id = semester.id;
            acc[id] = semester.shortName.value;
            return acc;
        }, {});

        const dir = path.dirname(config.SEMESTERS_DIR);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(config.SEMESTERS_DIR, JSON.stringify(semesterMap, null, 2), "utf8");
    } catch (error) {
        console.error("Error fetching or processing semesters data:", error);
    }
};

export { fetchAndSaveSemestersList };
