import cliProgress from 'cli-progress';

export default async function keySimilarity(arr, key, identificationKey) {
    const threshold = 0.75; // Adjust similarity threshold as needed
    const mergedArray = [];
    const mergedRecords = new Set(); // Track indices of merged items
    arr = arr.slice(0, 1500); // Process only a subset of data

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar(
        {
            format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Processing...`,
        },
        cliProgress.Presets.shades_classic,
    );

    // Start progress bar
    progressBar.start(arr.length, 0);

    // Function to calculate similarity using Jaccard and Levenshtein
    function calculateSimilarity(str1, str2) {
        const words1 = str1.toLowerCase().split(/\s+/);
        const words2 = str2.toLowerCase().split(/\s+/);

        const exactMatches = words1.filter(word => words2.includes(word)).length;
        const exactMatchPercentage = exactMatches / Math.max(words1.length, words2.length);

        // If exact word match percentage is higher than 70%, return a high similarity score
        if (exactMatchPercentage > 0.7) {
            return 1;
        }
        const set1 = new Set(words1);
        const set2 = new Set(words2);

        const intersection = [...set1].filter(word => set2.has(word)).length;
        const union = set1.size + set2.size - intersection;
        const jaccardSimilarity = intersection / union;

        const levenshteinDistance = levenshtein(str1, str2);
        const maxLen = Math.max(str1.length, str2.length);
        const levenshteinSimilarity = 1 - (levenshteinDistance / maxLen);

        // Calculate exact word match percentage


        // Adjusted similarity calculation to give more weight to exact word matches
        return (2 * jaccardSimilarity + levenshteinSimilarity) / 3;
    }

    function levenshtein(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () => []);
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

    arr.forEach((item, index) => {
        if (mergedRecords.has(index)) {
            mergedArray.push(item); // Add item as-is if it's already part of a merged group
            return;
        }

        const currentTitle = item[key];
        const currentProfessor = item.professor;
        const mergedIds = [];

        for (let i = index + 1; i < arr.length; i++) {
            if (mergedRecords.has(i)) continue;

            const comparisonTitle = arr[i][key];
            const comparisonProfessor = arr[i].professor;
            const similarity = calculateSimilarity(currentTitle, comparisonTitle);

            if (similarity >= threshold && currentProfessor === comparisonProfessor) {
                mergedIds.push(arr[i][identificationKey]);
                mergedRecords.add(i);
            }
        }

        // Add mergedIds only if similar items were found
        const mergedObject = mergedIds.length > 0
            ? { ...item, mergedIds }
            : { ...item };

        mergedArray.push(mergedObject);

        // Update progress bar
        progressBar.update(index + 1);
    });

    // Stop progress bar
    progressBar.stop();

    return mergedArray;
}