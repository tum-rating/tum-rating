import axios from "axios";
import fs from "fs";
import cliProgress from "cli-progress";

const baseUrl =
    "https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses";

const fetchPage = async (page, options) => {
    const {pageSize, termId} = options;
    const queryParams = `$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf`;
    const skip = (page - 1) * pageSize;
    const xmlUrl = `${baseUrl}?${queryParams}&$skip=${skip}&$top=${pageSize}`;

    try {
        const response = await axios.get(xmlUrl);
        return response.data.resource;
    } catch (error) {
        console.error("Error fetching XML data:", error);
        return [];
    }
};

const fetchPageWithRetry = async (page, options, maxRetries = 10, retryDelay = 5000) => {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            return await fetchPage(page, options);
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts} failed: ${error.message}`);
            if (attempts === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

const getNumberOfPages = async ({pageSize, termId}) => {
    const url = `https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses?$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf&$skip=0&$top=${pageSize}`;
    return axios.get(url).then((response) => {
        const totalCount = response.data.totalCount;
        return Math.ceil(totalCount / pageSize);
    });
};

const fetchAllPages = async (options) => {
    let {totalPages = 350, termId, pageSize} = options;
    const allCourses = [];
    const semesters = JSON.parse(fs.readFileSync("semesters.json", "utf8"));
    const semesterName = semesters[termId];
    const progressBar = new cliProgress.SingleBar(
        {
            format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Fetching {semester} ...`,
        },
        cliProgress.Presets.shades_classic,
    );
    return await getNumberOfPages({
        pageSize,
        termId,
        totalPages,
    }).then(async (numberOfPages) => {
        const allCourses = [];
        progressBar.start(numberOfPages, 0, {semester: semesterName})

        for (let page = 1; page <= numberOfPages; page++) {
            progressBar.update(page, {semester: semesterName});
            await fetchPageWithRetry(page, options).then((data) => {
                allCourses.push(...data);
            });
        }

        progressBar.stop({
            text: `Fetched ${allCourses.length} courses for ${semesterName}`,
        });
        return allCourses;
    });
};

export {fetchAllPages};