import fs from 'fs';
import prompt from 'prompts';
import {styleText} from 'node:util';
import ora from 'ora';
import path from 'node:path';
import {
    fetchAllPages,
    fetchSemestersList,
    mergeFetchedPages,
    saveFile,
    summarizeFetchedData,
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

const main = async () => {
    const spinner = ora('Fetching semesters...').start();

    try {
        await fetchSemestersList();
        spinner.succeed('Semesters list fetched successfully.');
    } catch (error) {
        spinner.fail('Failed to fetch semesters');
        console.error(error);
        return;
    }

    console.log(styleText(['underline', 'bold', 'magenta'], 'TUM-RATING scraper'));

    if (fs.existsSync('semesters.json')) {
        const choices = [
            {title: 'Fetch courses (and merge if needed)', value: 'fetch-and-merge'},
            {title: 'Merge existing files', value: 'merge-existing'},
            {title: 'Fetch semesters list and save to semesters.json', value: 'fetchSemestersList'},
        ];

        const response = await prompt({
            type: 'select',
            name: 'value',
            message: 'What do you want to do?',
            choices: choices,
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
        }
    } else {
        console.log('Semesters data is not available. Please try again.');
    }
};

main().catch(error => {
    console.error('An unexpected error occurred:', error);
});
