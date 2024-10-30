document.getElementById("jsonUpload").addEventListener("change", loadJSON);
document.getElementById("runComparison").addEventListener("click", runSimilarityCheck);
document.getElementById("getCourses").addEventListener("click", getCoursesFromTUMRating);

let jsonData = [];
let similarityResults = [];

function loadJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            jsonData = JSON.parse(e.target.result);
            displayOriginalJSON();
        } catch (error) {
            alert("Invalid JSON file");
        }
    };
    reader.readAsText(file);
}

function displayOriginalJSON() {
    const container = document.getElementById("originalJSON");
    container.innerHTML = `<h3>Original JSON</h3><pre>${JSON.stringify(jsonData, null, 2)}</pre>`;
}

async function getCoursesFromTUMRating() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `<h3>Loading courses...</h3><p id="progress">0 courses downloaded</p>`;
    document.body.appendChild(loader);

    let allCourses = [];
    let pageNumber = 1;
    const pageSize = 500;
    let totalCourses = 0;

    while (pageNumber) {
        const response = await fetch(`https://tum-rating.de/api/v1/courses?page-number=${pageNumber}&page-size=${pageSize}`);
        const data = await response.json();
        allCourses = allCourses.concat(data.results);
        totalCourses += data.results.length;
        document.getElementById("progress").innerText = `${totalCourses} courses downloaded`;

        console.log(data.nextPageNumber)
        pageNumber = data.nextPageNumber;
    }

    jsonData = allCourses;
    displayOriginalJSON();
    document.body.removeChild(loader);
}

function runSimilarityCheck() {
    similarityResults = [];
    const threshold = 0.75;
    const keyToCompare = "name";

    jsonData.forEach((obj1, index1) => {
        jsonData.forEach((obj2, index2) => {
            if (index1 !== index2) {
                const similarity = calculateHybridSimilarity(obj1[keyToCompare], obj2[keyToCompare]);
                if (similarity >= threshold) {
                    similarityResults.push({ obj1, obj2, similarity });
                }
            }
        });
    });

    displaySuggestedMerges();
}

function calculateHybridSimilarity(str1, str2) {
    const levDist = levenshteinDistance(str1, str2);
    const jaccardSim = jaccardSimilarity(str1, str2);
    return (1 - levDist / Math.max(str1.length, str2.length)) * 0.5 + jaccardSim * 0.5;
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

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

function jaccardSimilarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\W+/));
    const setB = new Set(b.toLowerCase().split(/\W+/));

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return intersection.size / union.size;
}

function displaySuggestedMerges() {
    const container = document.getElementById("suggestedMerges");
    container.innerHTML = "<h3>Suggested Merges</h3>";
    similarityResults.forEach((result, index) => {
        const mergeOption = document.createElement("div");
        mergeOption.classList.add("highlight");
        mergeOption.innerHTML = `
            <p>Similarity: ${result.similarity.toFixed(2)}</p>
            <pre>${JSON.stringify(result.obj1, null, 2)}</pre>
            <pre>${JSON.stringify(result.obj2, null, 2)}</pre>
            <button class="accept" onclick="acceptMerge(${index})">Accept</button>
            <button class="reject" onclick="rejectMerge(${index})">Reject</button>
        `;
        container.appendChild(mergeOption);
    });
}

function acceptMerge(index) {
    alert("Merge accepted");
}

function rejectMerge(index) {
    document.getElementById("suggestedMerges").children[index].style.display = "none";
}