import fs from "fs";
import _ from "lodash";
import prompt from "prompts";
import { fetchAllPages, summariesFn } from "./utils.js";

function strToUnicode(str) {
  return Array.from(str)
    .map((ch) => ch.charCodeAt(0).toString(16))
    .join(" ");
}

const compareDatasets = (oldData, newData) => {
  const added = newData
    .filter((item) => !oldData.some((old) => old.courseId === item.courseId))
    .map((item) => item.courseId);
  const removed = oldData
    .filter(
      (item) => !newData.some((newItem) => newItem.courseId === item.courseId),
    )
    .map((item) => item.courseId);

  const modified = oldData.reduce((acc, current) => {
    const newItem = newData.find((item) => item.courseId === current.courseId);
    if (!newItem) return acc;
    const differences = {};
    for (let key in current) {
      if (current[key] instanceof Object) {
        for (let subKey in current[key]) {
          if (
            typeof current[key][subKey] === "string" &&
            typeof newItem[key][subKey] === "string"
          ) {
            if (
              strToUnicode(current[key][subKey]) !==
              strToUnicode(newItem[key][subKey])
            ) {
              differences[key] = {
                before: {
                  value: current[key][subKey],
                  unicode: strToUnicode(current[key][subKey]),
                },
                after: {
                  value: newItem[key][subKey],
                  unicode: strToUnicode(newItem[key][subKey]),
                },
              };
            }
          } else if (!_.isEqual(current[key][subKey], newItem[key][subKey])) {
            differences[key] = { before: current[key], after: newItem[key] };
          }
        }
      } else if (current[key] !== newItem[key]) {
        differences[key] = { before: current[key], after: newItem[key] };
      }
    }

    if (Object.keys(differences).length > 0)
      acc.push({ courseId: current.courseId, changes: differences });

    return acc;
  }, []);

  return { added, removed, modified };
};

const deleteFile = (filename) => {
  fs.unlinkSync(filename);
  console.info(`File ${filename} deleted.`);
};
const mergeDatasets = (oldData, newData) => {
  return _.unionWith(oldData, newData, _.isEqual);
};

const saveFile = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data), "utf8");
  console.info(`Data saved to ${filename}`);
};

fetchAllPages().then(async (newCourses) => {
  summariesFn(newCourses).then(async (newSummaries) => {
    const oldCourses = JSON.parse(fs.readFileSync("output.json", "utf8"));
    // Temporarily save the new data
    saveFile("temp.json", newSummaries);

    // Compare the new data with the old data
    const { added, removed, modified } = compareDatasets(
      oldCourses,
      newSummaries,
    );
    const differences = { added, removed, modified };

    // Save the differences into a new file
    saveFile("differences.json", differences);

    const response = await prompt({
      type: "select",
      name: "value",
      message: "Check differences.json and decide what to do:",
      choices: [
        {
          title: "Merge output.json with changes from differences.json",
          value: "merge",
        },
        { title: "Overwrite output.json with temp.json", value: "overwrite" },
        { title: "nara", value: "" },
      ],
    });

    switch (response.value) {
      case "merge":
        const mergedData = mergeDatasets(oldCourses, newSummaries);
        saveFile("output.json", mergedData);
        deleteFile("temp.json");
        break;
      case "overwrite":
        saveFile("output.json", newSummaries);
        deleteFile("temp.json");
        break;
    }
  });
});
