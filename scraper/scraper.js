import fs from 'fs';
import prompt from 'prompts';
import ora from 'ora';
import path from 'path';
import {
    fetchAllPages,
    fetchAndSaveSemestersList,
    mergeFetchedPages,
    saveFile,
    summarizeFetchedData,
    fetchAndSaveProductionCourses
} from './utils/index.js';

const fetchAndMerge = async (semestersData) => {
    const semesterChoices = Object.entries(semestersData)
        .map(([id, name]) => ({
            title: `${name} - ${id}`,
            value: id,
        }))
        .reverse();

    const response = await prompt({
        type: 'multiselect',
        name: 'value',
        hint: 'If you fetch more than one semester, the data will have to be merged. Conflicts will be resolved interactively.',
        message: 'Pick semesters',
        choices: semesterChoices,
        min: 1,
    });

    if (response.value.length) {
        for (let semesterId of response.value) {
            try {
                const courses = await fetchAllPages({
                    termId: semesterId,
                    totalPages: 5,
                    pageSize: 20,
                });
                const summaries = await summarizeFetchedData(courses);
                const filename = `./fetched/${semestersData[semesterId].replaceAll(' ', '-')}-${semesterId}-${new Date()}.json`;
                saveFile(filename, summaries);
                console.log(`Saved fetched data to ${filename}`);
            } catch (error) {
                console.error(`Failed to fetch and save courses for semester ${semesterId}:`, error);
            }
        }
    }
};

const mergeFiles = async () => {
    const fetchedFiles = fs.readdirSync('./fetched');
    const fetchedFilesChoices = fetchedFiles.map((filename) => ({
        title: filename,
        value: path.resolve('./fetched', filename),
    }));

    const mergeResponse = await prompt({
        type: 'multiselect',
        name: 'value',
        hint: 'Select the files you want to merge',
        message: 'Pick files to merge',
        choices: fetchedFilesChoices,
        min: 2,
    });

    const selectedFiles = mergeResponse.value;
    const spinner = ora('Merging files...').start();
    try {
        await mergeFetchedPages(selectedFiles).then((data) => {
            spinner.succeed('Files merged successfully.');
            saveFile(`./merged/merged-${new Date()}.json`, data)
        });
        console.log('Files merged successfully.');
    } catch (error) {
        spinner.fail('Failed to merge files');
        console.error('Failed to merge files:', error);
    }
};


const listJsonFiles = () => {
    return fs.readdirSync('./').filter(file => file.endsWith('.json'));
};

const mergeSelectedFiles = (files) => {
    return files.reduce((acc, file) => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        return [...acc, ...data];
    }, []);
};

const extractKeysFromFirstObject = (data) => {
    return Object.keys(data[0]);
};

const runKeyMatchingAlgorithm = (data, keys) => {
    // Placeholder for the key-matching algorithm
    console.log('Running key-matching algorithm on data with keys:', keys);
    // Implement the actual key-matching logic here
};

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

    console.log(styleText(['underline', 'bold', 'magenta'], 'TUM-RATING scraper'));

    if (fs.existsSync('semesters.json')) {
        const fetchedDirExists = fs.existsSync('./fetched');
        const fetchedDirLength = fetchedDirExists ? fs.readdirSync('./fetched').length : 0;
        const fetchedDirNotEmpty = fetchedDirExists && fetchedDirLength > 0;

        const mergedDirExists = fs.existsSync('./merged');
        const mergedDirLength = mergedDirExists ? fs.readdirSync('./merged').length : 0;
        const mergedDirNotEmpty = mergedDirExists && mergedDirLength > 0;

        const productionCoursesExists = fs.existsSync('productionCourses.json');

        const choices = [
            {
                title: `Fetch courses (and merge if needed)`,
                value: 'fetch-and-merge'
            },
            {
                title: `Merge existing files - ${!fetchedDirNotEmpty ? "No fetched data available - ./fetched is empty or doesn't exist" : `${fetchedDirLength} files in ./fetched`}`,
                value: 'merge-existing',
                disabled: !fetchedDirNotEmpty
            },
            {
                title: `Fetch courses from production database and store in ./productionCourses${productionCoursesExists ? ' (will overwrite existing data)' : ''}`,
                value: 'fetch-from-prod-db',
            },
            {
                title: `Run names matching script on ./productionCourses`,
                value: 'run-matching-script',
            },
            {
                title: `Run key-matching algorithm on selected files`,
                value: 'run-key-matching',
            },
            {
                title: `Update courses from database with merged courses - ${!mergedDirNotEmpty ? "No merged data available - ./merged is empty or doesn't exist" : `${mergedDirLength} files in ./merged`}`,
                value: 'db-fetch-and-update',
                disabled: !mergedDirNotEmpty
            },
            {
                title: 'Fetch semesters list and save to semesters.json',
                value: 'fetchSemestersList'
            },
        ];

        const response = await prompt({
            type: 'select',
            name: 'value',
            message: 'What do you want to do?',
            choices: choices,
            instructions: false,
        });

        const semestersData = JSON.parse(fs.readFileSync('semesters.json', 'utf8'));

        switch (response.value) {
            case 'fetch-and-merge':
                await fetchAndMerge(semestersData);

                const nextStepAfterFetch = await prompt({
                    type: 'select',
                    name: 'value',
                    message: 'What do you want to do next?',
                    choices: [
                        {title: 'Merge fetched files', value: 'merge'},
                        {title: 'Exit', value: 'exit'},
                    ],
                });

                if (nextStepAfterFetch.value === 'merge') {
                    await mergeFiles();
                }
                break;

            case 'merge-existing':
                await mergeFiles();
                break;

            case 'update-db':
                console.log('Not implemented yet');
                break;

            case 'fetch-from-prod-db':
                if (productionCoursesExists) {
                    const confirmOverwrite = await prompt({
                        type: 'confirm',
                        name: 'value',
                        message: 'productionCourses.json already exists. Do you want to overwrite it?',
                        initial: false,
                    });

                    if (!confirmOverwrite.value) {
                        console.log('Operation cancelled.');
                        return;
                    }
                }

                const success = await fetchAndSaveProductionCourses();
                if (success) {
                    const nextStepAfterProdFetch = await prompt({
                        type: 'select',
                        name: 'value',
                        message: 'What do you want to do next?',
                        choices: [
                            {title: "🪄 run comparsion script for fetched courses and open diff ui", value: "magic"},
                            {title: 'Return to previous menu', value: 'return'},
                            {title: 'Exit', value: 'exit'},
                        ],
                    });

                    if (nextStepAfterProdFetch.value === 'return') {
                        await main();
                    }
                }
                break;

            case 'run-key-matching':
                const jsonFiles = listJsonFiles();
                const fileSelection = await prompt({
                    type: 'multiselect',
                    name: 'files',
                    message: 'Select JSON files to merge',
                    choices: jsonFiles.map(file => ({ title: file, value: file })),
                });

                const mergedData = mergeSelectedFiles(fileSelection.files);
                const keys = extractKeysFromFirstObject(mergedData);

                const keySelection = await prompt({
                    type: 'multiselect',
                    name: 'keys',
                    message: 'Select keys to use in the key-matching algorithm',
                    choices: keys.map(key => ({ title: key, value: key })),
                });

                runKeyMatchingAlgorithm(mergedData, keySelection.keys);
                break;
        }
    } else {
        console.log('Semesters data is not available. Please try again.');
    }
};

main().catch(error => {
    console.error('An unexpected error occurred:', error);
});
