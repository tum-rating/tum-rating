import path from "path";
import fs from "fs";
import config from "../config.js";
import open from 'open';

export const runCheckingApp = async () => {
    const prepareTempFiles = async () => {
        const appFilePath = path.join(config.CHECKING_APP_DIR, 'temp');
        const finalFilePath = path.join(config.FINAL_DATA_DIR, 'final_merged_data.json');
        const mergedFilePath = path.join(config.MERGED_FILES_DIR, 'merged_courses.json');
        const referencesMergedFilePath = path.join(config.MERGED_FILES_DIR, '__temp.json');

        if (!fs.existsSync(appFilePath)) {
            fs.mkdirSync(appFilePath, { recursive: true });
        }
        await fs.copyFileSync(finalFilePath, path.join(appFilePath, 'computed_courses.json'));
        await fs.copyFileSync(mergedFilePath, path.join(appFilePath, 'all_courses.json'));
        await fs.copyFileSync(referencesMergedFilePath, path.join(appFilePath, 'all_courses_map.json'));
    }

    const runApp = () => {
        const indexPath = path.join(config.CHECKING_APP_DIR, 'dist', 'index.html');
        open(indexPath, { wait: true });
    }

    await prepareTempFiles();
    runApp();
}