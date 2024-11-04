import cliProgress from 'cli-progress';

export default async function keySimilarity(arr, key, identificationKey) {
    const threshold = 0.8;
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

    function calculateSimilarity(str1, str2) {
        const words1 = str1.toLowerCase().split(/\s+/);
        const words2 = str2.toLowerCase().split(/\s+/);

        const commonWords = words1.filter(word => words2.includes(word)).length;
        const exactMatchPercentage = commonWords / Math.max(words1.length, words2.length);
        if (exactMatchPercentage > 0.75) return 1;

        const set1 = new Set(words1);
        const set2 = new Set(words2);

        const intersection = [...set1].filter(word => set2.has(word)).length;
        const union = set1.size + set2.size - intersection;
        const jaccardSimilarity = intersection / union;

        const levenshteinDistance = levenshtein(str1, str2);
        const maxLen = Math.max(str1.length, str2.length);
        const levenshteinSimilarity = 1 - (levenshteinDistance / maxLen);

        const adjustedSimilarity = (2 * exactMatchPercentage + jaccardSimilarity + levenshteinSimilarity) / 4;
        return adjustedSimilarity;
    }

    function levenshtein(a, b) {
        const matrix = Array.from({length: a.length + 1}, () => []);
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[a.length][b.length];
    }

    function findCommonSubstring(strings) {
        if (!strings.length) return '';
        let commonSubstring = strings[0];
        for (let i = 1; i < strings.length; i++) {
            let tempSubstring = '';
            for (let j = 0; j < commonSubstring.length; j++) {
                for (let k = j + 1; k <= commonSubstring.length; k++) {
                    const substring = commonSubstring.slice(j, k);
                    if (strings[i].includes(substring) && substring.length > tempSubstring.length) {
                        tempSubstring = substring;
                    }
                }
            }
            commonSubstring = tempSubstring;
        }
        return commonSubstring;
    }

    function cleanCommonPart(commonPart) {
        const redundantWords = ['Exercise', 'Lecture', 'Basic', 'Module', 'In-Depth', 'Limited places', 'English', 'German'];
        let cleanedPart = commonPart;
        redundantWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            cleanedPart = cleanedPart.replace(regex, '').trim();
        });

        // Remove any empty parentheses or other punctuation left after removing redundant words
        cleanedPart = cleanedPart.replace(/\(\s*\)/g, '').replace(/\[\s*\]/g, '').replace(/\{\s*\}/g, '').replace(/,\s*,/g, ',').replace(/,\s*$/, '').trim();

        return cleanedPart;
    }

    arr.forEach((item, index) => {
        if (mergedRecords.has(index)) {
            mergedArray.push(item);
            return;
        }

        const currentTitle = item[key];
        const currentProfessor = item.professor;
        const currentCodes = extractCodes(currentTitle);
        const mergedIds = [];
        const mergedTitles = [currentTitle];

        for (let i = index + 1; i < arr.length; i++) {
            if (mergedRecords.has(i)) continue;

            const comparisonTitle = arr[i][key];
            const comparisonProfessor = arr[i].professor;
            const comparisonCodes = extractCodes(comparisonTitle);
            const similarity = calculateSimilarity(currentTitle, comparisonTitle);

            if (similarity >= threshold && (!currentProfessor || currentProfessor === comparisonProfessor)) {
                if (similarity === 1) {
                    mergedIds.push(arr[i][identificationKey]);
                    mergedRecords.add(i);
                    continue;
                }

                mergedIds.push(arr[i][identificationKey]);
                mergedRecords.add(i);
                mergedTitles.push(comparisonTitle);

                comparisonCodes.forEach(code => {
                    currentCodes.add(code);
                });
            }
        }

        let mergedCourseNameProposal;
        if (mergedIds.length > 0) {
            const commonPart = findCommonSubstring(mergedTitles);
            const cleanedCommonPart = cleanCommonPart(commonPart);
            const mergedCodesArray = Array.from(currentCodes).filter(code => !cleanedCommonPart.includes(code));
            if (mergedCodesArray.length > 0) {
                mergedCourseNameProposal = `(${[...new Set(mergedCodesArray)].join(', ')}) ${cleanedCommonPart.trim()}`;
            } else {
                mergedCourseNameProposal = cleanedCommonPart.trim();
            }
        }

        const mergedObject = {
            ...item,
            codes: Array.from(currentCodes),
            mergedIds: mergedIds.length > 0 ? mergedIds : undefined
        };

        if (mergedIds.length > 0) {
            mergedObject.mergedCourseNameProposal = mergedCourseNameProposal;
        }

        mergedArray.push(mergedObject);
        progressBar.update(index + 1);
    });

    progressBar.stop();

    return mergedArray;
}