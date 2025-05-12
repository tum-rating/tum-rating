import {distance as levenshteinDistance} from "fastest-levenshtein";
import { v4 as uuidv4 } from 'uuid';
export default async function keySimilarityCore(arr, key, identificationKey, progressCallback) {
    const mergedArray = [];
    const mergedRecords = new Map();
    const codePattern = /\b([A-Z]{2,}[0-9]+(?:_[0-9]+)?(?:\s+[A-Z]+)?(?:\s+[A-Z]{2})?)\b/g;
    // arr = arr.slice(0, 1500);

    function extractCodes(title) {
        const codes = new Set();
        let match;
        while ((match = codePattern.exec(title)) !== null) {
            codes.add(match[0]);
        }
        return codes;
    }

    function redundantWordsExtractor(title) {
        const redundantWords = ["exercise", "seminar", "advanced", "course", "engineering", "english", "german", "research", "master", "exercises", "theory", "practical", "colloquium", "project"];
        const redundantWordsPattern = new RegExp(`\\b(${redundantWords.join("|")})\\b`, "gi");
        const delimitersPattern = /[()\[\],-]/g;
        const cleanedTitle = title.replace(redundantWordsPattern, "").replace(codePattern, "").replace(delimitersPattern, "").trim();
        const codes = extractCodes(title);
    }

    function checkIfCoursesHaveAtLeastOneCommonWord(course1, course2) {
        const words1 = course1.split(" ").filter(word => word.length > 1);
        const words2 = course2.split(" ").filter(word => word.length > 1);
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length > 0;
    }

    for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        const similarRecords = [];
        const {cleanedTitle: itemTitle, codes: currentCodes} = redundantWordsExtractor(item[key]);
        const offeredInSemesters = new Set(item.offeredInSemesters);

        if (mergedRecords.has(index)) {
            progressCallback?.(index + 1);
            continue;
        }
        for (let i = index + 1; i < arr.length; i++) {
            if (mergedRecords.has(i)) continue;

            const record = arr[i];
            const {cleanedTitle: recordTitle, codes: recordCodes} = redundantWordsExtractor(record[key]);
            const similarity = levenshteinDistance(itemTitle, recordTitle);

            if (similarity < 25 && record.professor === item.professor && checkIfCoursesHaveAtLeastOneCommonWord(itemTitle, recordTitle)) {
                similarRecords.push({
                    ...record,
                    similarity: similarity,
                    codes: Array.from(recordCodes),
                    offeredInSemesters: record.offeredInSemesters,
                });
                recordCodes.forEach(code => currentCodes.add(code));
                record.offeredInSemesters.forEach(semester => offeredInSemesters.add(semester));
                mergedRecords.set(i, true);
            }
        }

        if (similarRecords.length > 0) {
            mergedArray.push({
                name: item[key],
                merged: [{
                    ...item,
                    similarity: 0,
                    codes: Array.from(currentCodes),
                    offeredInSemesters: Array.from(offeredInSemesters),
                }, ...similarRecords],
                codes: Array.from(currentCodes),
                offeredInSemesters: Array.from(offeredInSemesters),
                professor: item.professor,

                courseId: "",
                courseNumber: "",
                id: uuidv4()
            });
        } else {
            mergedArray.push({
                ...item,
                codes: Array.from(currentCodes),
                merged: [],
            });
        }
        progressCallback?.(index + 1);
    }

    return mergedArray;
}