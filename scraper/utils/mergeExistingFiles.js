import fs from 'fs';
import path from 'path';
import prompt from 'prompts';

const mergeExistingFiles = async () => {
    const dirPath = './fetchedFromProd';
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));

    const fileChoices = files.map(file => ({
        title: file,
        value: path.join(dirPath, file)
    }));

    const { selectedFiles } = await prompt({
        type: 'multiselect',
        name: 'selectedFiles',
        message: 'Select files to merge',
        choices: fileChoices,
        instructions: false,
    });

    if (selectedFiles.length === 0) {
        console.log("No files selected for merging.");
        return;
    }

    let mergedData = [];
    for (const filePath of selectedFiles) {
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        mergedData = mergedData.concat(fileData);
    }

    const mergedFilePath = path.join(dirPath, 'merged_courses.json');
    fs.writeFileSync(mergedFilePath, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log(`Merged data saved to ${mergedFilePath}`);
};

const checkAndCreateDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export { mergeExistingFiles, checkAndCreateDir };