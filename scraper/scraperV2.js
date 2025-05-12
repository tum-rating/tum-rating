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
import {mergeExistingFilesByKeySimilarity} from "./utils/mergeExistingFilesByKeySimilarity.js";
import {runCheckingApp} from "./utils/runCheckingApp.js";

const main = async (callback) => {
    // console.clear();

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

    callback?.();
    const {fetchedSemesters} = await getSemestersFiles();
    if (fetchedSemesters) {
        const {fetchedDBCourses, fetchedDBCoursesLength, fetchedDBCoursesNotEmpty} = getDbCoursesFiles();
        const choices = [
            {
                title: `Fetch courses from production database. (${fetchedDBCoursesLength} ${fetchedDBCoursesLength === 1 ? 'file' : 'files'} in ./fetchedFromProd)`,
                value: "fetch-from-prod-db"
            },
            {
                title: `Merge existing files with ${chalk.green("key similarity method")}.`,
                value: "merge-existing-by-key-similarity"
            },
            {
                title: `Run courses checking app.`,
                value: "run-checking-app"
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
                        return main(() => {
                            console.log(`ℹ️ Please rename or remove the existing ${path.basename(coursesFilePath)} file in ./fetchedFromProd and try again.`);
                        })
                    }
                }
                await fetchAndSaveProductionCourses();
                await main(() => {
                    console.log("✅ Courses successfully fetched from production database.")
                })
                break;
            case "merge-existing-by-key-similarity":
                // result is user decision about if they want run checking app after merging
                const result = await mergeExistingFilesByKeySimilarity();
                if(!result){
                    return main(() => {
                        console.log("✅ Merging completed successfully.")
                    })
                }else{
                    await runCheckingApp();
                }
                break;
            case "run-checking-app":
                await runCheckingApp();
                break;
            default:
        }
    }
};


main().catch(error => {
    console.error('An unexpected error occurred:', error);
});