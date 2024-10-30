import fs from 'fs';
import path from 'path';
import prompt from 'prompts';
import ora from 'ora';
import config from "../config.js";
import keySimilarity from "./merging/keySimilarity.js";

/**
 * Merges JSON files by key similarity after checking for key consistency.
 *
 * This function performs the following steps:
 * 1. Reads JSON files from the specified directory.
 * 2. Prompts the user to select files to merge.
 * 3. Checks if the JSON objects in the selected files have the same keys.
 * 4. If there is a key mismatch, it prints which key is lacking in which file and exits.
 * 5. If all keys match, it prompts the user to select which keys to compare for similarity.
 * 6. Prompts the user to select an identification key.
 * 7. Merges the selected files and saves the merged data to a new file.
 * 8. Stores references to the merged data objects in a `__temp` file for user-checking actions.
 * 9. Prompts the user to either run the checking application or continue without checking.
 * 10. If the user continues without checking, overwrites the `merged_courses.json` file with the merged JSON data.
 *
 * @async
 * @function mergeExistingFilesByKeySimilarity
 */
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
        const tempFilePath = path.join(dirPath, '__temp.json');
        fs.writeFileSync(tempFilePath, JSON.stringify(references, null, 2), 'utf8');
        console.log(`References saved to ${tempFilePath}`);


        const similarityResults = await keySimilarity(mergedData, checkKey, idKey);

        // Ensure FINAL_DATA_DIR exists
        if (!fs.existsSync(finalDataDir)) {
            fs.mkdirSync(finalDataDir, { recursive: true });
        }

        // Save the similarity results to FINAL_DATA_DIR
        const finalFilePath = path.join(finalDataDir, 'final_merged_data.json');
        fs.writeFileSync(finalFilePath, JSON.stringify(similarityResults, null, 2), 'utf8');
        console.log(`Final merged data saved to ${finalFilePath}`);

    } catch (error) {
        console.error(error);
    }
};

export { mergeExistingFilesByKeySimilarity };