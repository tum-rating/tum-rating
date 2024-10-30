import ora from "ora";
import {fetchAndSaveProductionCourses, fetchAndSaveSemestersList} from "./services/index.js";
import chalk from 'chalk';
import config from "./config.js";
import prompt from 'prompts';
import getDbCoursesFiles from "./utils/files/getDbCoursesFiles.js";
import getSemestersFiles from "./utils/files/getSemestersFiles.js";
import fs from 'fs';
import path from "path";
import {displayHeader} from "./utils/display.js";
import {mergeExistingFiles} from "./utils/mergeExistingFiles.js";

const main = async () => {
    const spinner = ora('Fetching semesters...').start();
    try {
        await fetchAndSaveSemestersList();
        spinner.succeed('Semesters list fetched successfully.');
    } catch (error) {
        spinner.fail('Failed to fetch semesters');
        console.error(error);
        return;
    }

    await displayHeader()

    const {fetchedSemesters} = await getSemestersFiles();
    if (fetchedSemesters) {
        const {fetchedDBCourses, fetchedDBCoursesLength, fetchedDBCoursesNotEmpty} = getDbCoursesFiles();
        const choices = [
            {
                title: `Fetch courses from production database. (${fetchedDBCoursesLength} files in ./fetchedFromProd)`,
                value: "fetch-from-prod-db"
            },
            {
                title: `Merge existing files`,
                value: "merge-existing",
            }
        ];

        const response = await prompt({
            type: 'select',
            name: 'value',
            message: 'What do you want to do?',
            choices: choices,
            instructions: false,
        });

        switch (response.value) {
            case "fetch-from-prod-db":
                const coursesFilePath = config.PROD_DB_COURSES_DIR;
                if (fs.existsSync(coursesFilePath)) {
                    const confirmOverwrite = await prompt({
                        type: 'confirm',
                        name: 'value',
                        message: `${path.basename(coursesFilePath)} already exists in ./fetchedFromProd. ${chalk.red('You will lose all existing data and it will be overwritten with new data.')}\nDo you want to overwrite it?`,
                        initial: false,
                    });

                    if (!confirmOverwrite.value) {
                        return main().then(() => {
                            console.log(`Please rename the existing ${path.basename(coursesFilePath)} file in ./fetchedFromProd and try again.`);
                        })
                    }
                }

                await fetchAndSaveProductionCourses();
                console.log(1)
                // await main().then(() =>
                //     console.log("✅Courses successfully fetched from production database.")
                // );
                break;
            case "merge-existing":
                console.log("Merging existing files...");
                await mergeExistingFiles();
                break;
            default:
                console.log("default");
        }
    }
};


main().catch(error => {
    console.error('An unexpected error occurred:', error);
});