import fs from 'fs';
import path from 'path';
import prompt from 'prompts';
import ora from 'ora';
import config from "../config.js";

import keySimilarityWithProgress from "./merging/keySimilarityWithCliProgress.js";

const mergeExistingFilesByKeySimilarity = async () => {
    try {
        // Read JSON files from the specified directory
        const files = fs.readdirSync(config.PROD_DB_COURSES_DIR).filter(file => file.endsWith('.json'));
        const dirPath = config.MERGED_FILES_DIR;
        const finalDataDir = config.FINAL_DATA_DIR;

        const checkKey = 'name'
        const idKey = 'id'

        // Create choices for the prompt
        const fileChoices = files.map(file => ({
            title: file,
            value: path.join(config.PROD_DB_COURSES_DIR, file)
        }));

        // Prompt the user to select files to merge
        const { selectedFiles } = await prompt({
            type: 'multiselect',
            name: 'selectedFiles',
            message: 'Select files to merge',
            choices: fileChoices,
            instructions: true,
        });

        // If no files are selected, log a message and return
        if (selectedFiles.length === 0) {
            console.log("No files selected for merging.");
            return;
        }

        // Read the first object from each selected file to check for key consistency
        const firstObjects = selectedFiles.map(filePath => {
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            return fileData[0];
        });

        // Get the keys of the first object in the first file
        const referenceKeys = Object.keys(firstObjects[0]);

        // Check for key consistency
        const keyMismatch = selectedFiles.some((filePath, index) => {
            const fileKeys = Object.keys(firstObjects[index]);
            return !referenceKeys.every(key => fileKeys.includes(key));
        });

        // If there is a key mismatch, print which key is lacking in which file and return
        if (keyMismatch) {
            selectedFiles.forEach((filePath, index) => {
                const fileKeys = Object.keys(firstObjects[index]);
                referenceKeys.forEach(key => {
                    if (!fileKeys.includes(key)) {
                        console.log(`Key "${key}" is missing in file "${filePath}"`);
                    }
                });
            });
            return;
        }

        // Check and create the directory if it does not exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Merge the selected files and store references
        let mergedData = [];
        let references = [];
        for (const filePath of selectedFiles) {
            const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            mergedData = mergedData.concat(fileData);
            references.push(...fileData.map((item,index) => ({ [item[idKey]]: index})));
        }

        // Save the merged data to a new file
        const mergedFilePath = path.join(dirPath, 'merged_courses.json');
        fs.writeFileSync(mergedFilePath, JSON.stringify(mergedData, null, 2), 'utf8');
        console.log(`Merged data saved to ${mergedFilePath}`);

        // Save the references to a __temp file
        const referencesMergedFilePath = path.join(dirPath, '__temp.json');
        fs.writeFileSync(referencesMergedFilePath, JSON.stringify(references, null, 2), 'utf8');
        console.log(`References saved to ${referencesMergedFilePath}`);

        const similarityResults = await keySimilarityWithProgress(mergedData, checkKey, idKey);

        // Ensure FINAL_DATA_DIR exists
        if (!fs.existsSync(finalDataDir)) {
            fs.mkdirSync(finalDataDir, { recursive: true });
        }

        // Save the similarity results to FINAL_DATA_DIR
        const finalFilePath = path.join(finalDataDir, 'final_merged_data.json');
        fs.writeFileSync(finalFilePath, JSON.stringify(similarityResults, null, 2), 'utf8');
        console.log(`Final merged data saved to ${finalFilePath}`);

        // Prompt the user to run the checking application or continue without checking
        const { runCheckingApp } = await prompt({
            type: 'confirm',
            name: 'runCheckingApp',
            message: 'Do you want to run courses checking app ?',
            initial: false,
        });

        if(runCheckingApp){

        }
        return runCheckingApp;

    } catch (error) {
        console.error(error);
    }
};

export { mergeExistingFilesByKeySimilarity };