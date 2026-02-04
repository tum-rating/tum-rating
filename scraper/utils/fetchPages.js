import axios from "axios";
import fs from "fs";
import cliProgress from "cli-progress";

const baseUrl =
    "https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses";

const fetchPage = async (page, options) => {
    const { pageSize, termId } = options;
    const queryParams = `$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf`;
    const skip = (page - 1) * pageSize;
    const xmlUrl = `${baseUrl}?${queryParams}&$skip=${skip}&$top=${pageSize}`;

    try {
        console.log(`[DEBUG] Fetching page ${page}, URL: ${xmlUrl.substring(0, 100)}...`);
        const response = await axios.get(xmlUrl);
        // API structure changed: now uses 'courses' instead of 'resource'
        // Try new structure first (courses), then fall back to old (resource) for backwards compatibility
        const data = response.data;
        const courses = data.courses || data.resource || [];
        console.log(`[DEBUG] Page ${page} success, status: ${response.status}, data length: ${courses.length}`);
        console.log(`[DEBUG] Page ${page} response keys:`, Object.keys(data));
        if (courses.length === 0 && data.courses === undefined && data.resource === undefined) {
            console.warn(`[DEBUG] Page ${page}: No courses found. Full response structure:`, JSON.stringify(data, null, 2).substring(0, 500));
        }
        return courses;
    } catch (error) {
        console.error(`[DEBUG] Error fetching page ${page}:`);
        console.error(`[DEBUG] Status: ${error.response?.status || 'N/A'}`);
        console.error(`[DEBUG] Status Text: ${error.response?.statusText || 'N/A'}`);
        console.error(`[DEBUG] Response Data:`, JSON.stringify(error.response?.data || error.message, null, 2));
        console.error(`[DEBUG] Full Error:`, error);
        return [];
    }
};

const fetchPageWithRetry = async (page, options, maxRetries = 10, retryDelay = 5000) => {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            const result = await fetchPage(page, options);
            if (result && result.length > 0) {
                return result;
            }
            // If result is empty array, it might be an error that was caught
            attempts++;
            console.error(`[DEBUG] Attempt ${attempts}: Got empty result for page ${page}`);
            if (attempts === maxRetries) {
                throw new Error(`Failed to fetch page ${page} after ${maxRetries} attempts (got empty results)`);
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        } catch (error) {
            attempts++;
            console.error(`[DEBUG] Attempt ${attempts} failed for page ${page}: ${error.message}`);
            if (attempts === maxRetries) {
                console.error(`[DEBUG] Max retries reached for page ${page}, throwing error`);
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

const getNumberOfPages = async ({ pageSize, termId }) => {
    const url = `https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses?$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf&$skip=0&$top=${pageSize}`;
    console.log(`[DEBUG] Getting number of pages, URL: ${url.substring(0, 100)}...`);
    return axios.get(url).then((response) => {
        console.log(`[DEBUG] Got response for page count, status: ${response.status}`);
        console.log(`[DEBUG] Response data keys:`, Object.keys(response.data || {}));
        const data = response.data;
        const totalCount = data.totalCount;
        console.log(`[DEBUG] Total count: ${totalCount}, page size: ${pageSize}, pages: ${Math.ceil(totalCount / pageSize)}`);
        if (!totalCount) {
            console.warn(`[DEBUG] No totalCount found. Full response:`, JSON.stringify(data, null, 2).substring(0, 500));
        }
        return Math.ceil(totalCount / pageSize);
    }).catch((error) => {
        console.error(`[DEBUG] Error getting number of pages:`);
        console.error(`[DEBUG] Status: ${error.response?.status || 'N/A'}`);
        console.error(`[DEBUG] Status Text: ${error.response?.statusText || 'N/A'}`);
        console.error(`[DEBUG] Response Data:`, JSON.stringify(error.response?.data || error.message, null, 2));
        throw error;
    });
};

const fetchAllPages = async (options) => {
    let { totalPages = 350, termId, pageSize } = options;
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
        progressBar.start(numberOfPages, 0, { semester: semesterName })

        for (let page = 1; page <= numberOfPages; page++) {
            progressBar.update(page, { semester: semesterName });
            try {
                const data = await fetchPageWithRetry(page, options);
                if (data && data.length > 0) {
                    allCourses.push(...data);
                    console.log(`[DEBUG] Page ${page}: Added ${data.length} courses, total: ${allCourses.length}`);
                } else {
                    console.warn(`[DEBUG] Page ${page}: Got empty data, skipping`);
                }
            } catch (error) {
                console.error(`[DEBUG] Failed to fetch page ${page} after retries:`, error.message);
                throw error;
            }
        }

        progressBar.stop({
            text: `Fetched ${allCourses.length} courses for ${semesterName}`,
        });
        return allCourses;
    });
};

export { fetchAllPages };