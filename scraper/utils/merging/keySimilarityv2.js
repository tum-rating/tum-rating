import cliProgress from 'cli-progress';
import { distance } from 'fastest-levenshtein';

export default async function keySimilarity(arr, key, identificationKey) {
    const mergedArray = [];
    const mergedRecords = new Set();
    arr = arr.slice(0, 1500);

    const progressBar = new cliProgress.SingleBar(
        {
            format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Processing...`,
        },
        cliProgress.Presets.shades_classic,
    );

    progressBar.start(arr.length, 0);

    function extractCodes(title) {
        const codePattern = /\b([A-Z]{2,}[0-9]+(?:_[0-9]+)?(?:\s+[A-Z]+)?(?:\s+[A-Z]{2})?)\b/g;
        const codes = new Set();
        let match;
        while ((match = codePattern.exec(title)) !== null) {
            codes.add(match[0]);
        }
        return codes;
    }

    arr.forEach((item, index) => {
        if (mergedRecords.has(index)) return;

        const recordsToCheck = arr.slice(index + 1);

        const similarRecords = recordsToCheck
            .map((record, recordIndex) => {
                if (mergedRecords.has(recordIndex + index + 1)) return null;
                const similarity = distance(item[key], record[key]);
                return { ...record, similarity };
            })
            .filter(record => record && record.similarity < 25 && record.professor === item.professor);

        if (similarRecords.length !== 0) {
            mergedArray.push({
                name: item[key],
                merged: [
                    item,
                    ...similarRecords
                ],
                codes: Array.from(
                    new Set(
                        similarRecords.reduce((acc, record) => {
                            return [...acc, ...extractCodes(record[key])];
                        }, extractCodes(item[key]))
                    )
                )
            });
            mergedRecords.add(index);
            return;
        } else {
            mergedArray.push({
                ...item,
                codes: Array.from(extractCodes(item[key]))
            });
        }
        progressBar.update(index + 1);
    });

    progressBar.stop();

    return mergedArray;
}