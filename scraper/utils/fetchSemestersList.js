import fs from "fs";
import axios from "axios";

const fetchSemestersList = async () => {
    const url =
        "https://campus.tum.de/tumonline/ee/rest/slc.lib.tm/semesters/student?$language=";
    try {
        const response = await axios.get(url);
        const semesters = response.data.semesters;
        const semesterMap = semesters.reduce((acc, semester) => {
            const id = semester.id;
            const name = semester.shortName.value;
            acc[id] = name;
            return acc;
        }, {});
        fs.writeFileSync(
            "semesters.json",
            JSON.stringify(semesterMap, null, 2),
            "utf8",
        );
    } catch (error) {
        console.error("Error fetching or processing semesters data:", error);
    }
};

export {fetchSemestersList};
