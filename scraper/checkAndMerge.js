import fs from "fs";
import _ from "lodash";
import prompt from "prompts";
import { styleText } from "node:util";
import { fetchAllPages, fetchSemestersList, summariesFn } from "./utils.js";
import ora from "ora";

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

// const fetchCourses = fetchAllPages().then(async (newCourses) => {
//   summariesFn(newCourses).then(async (newSummaries) => {
//     const oldCourses = JSON.parse(fs.readFileSync("output.json", "utf8"));
//     // Temporarily save the new data
//     saveFile("temp.json", newSummaries);
//
//     // Compare the new data with the old data
//     const { added, removed, modified } = compareDatasets(
//       oldCourses,
//       newSummaries,
//     );
//     const differences = { added, removed, modified };
//
//     // Save the differences into a new file
//     saveFile("differences.json", differences);
// })
// }
// );

(async () => {
  const spinner = ora("Fetching semesters...").start();

  try {
    await fetchSemestersList();
    spinner.succeed("Semesters list fetched successfully.");
  } catch (error) {
    spinner.fail("Failed to fetch semesters");
    console.error(error);
    return;
  }
  console.log(
    styleText(["underline", "bold", "magenta"], "TUM-RATING scraper"),
  );
  if (fs.existsSync("semesters.json")) {
    const differencesExist = fs.existsSync("differences.json");

    let choices = [
      // {
      //   title: "Merge output.json with changes from differences.json",
      //   value: "merge",
      // },
      // { title: "Overwrite output.json with temp.json", value: "overwrite" },
      { title: "Fetch courses (and merge if needed)", value: "fetch-and-merge" },
      {
        title: "Fetch semesters list and save to semesters.json",
        value: "fetchSemestersList",
      },
      { title: "nara", value: "" },
    ];

    const response = await prompt({
      type: "select",
      name: "value",
      message: "What you want to do",
      choices: choices,
    });

    switch (response.value) {
      case "fetch-and-merge":
        const semestersData = JSON.parse(
          fs.readFileSync("semesters.json", "utf8"),
        );
        const semesterChoices = Object.entries(semestersData)
          .map(([id, name]) => ({
            title: name,
            value: id,
          }))
          .reverse();
        const response = await prompt({
          type: "multiselect",
          name: "value",
          hint: "If you fetch more than one semester, the data will have to be merged. Conflicts will be resolved interactively.",
          message: "Pick semesters",
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
              const summaries = await summariesFn(courses);
              saveFile(
                `./fetched/${semesterId}-${new Date().toLocaleDateString()}.json`,
                summaries,
              );
            } catch (error) {
              console.error(error);
            }
          }
        }

        break;
      case "merge":
        // Implementation for merging
        break;
      case "overwrite":
        // Implementation for overwriting
        break;
      // Handle other cases as needed
    }
  } else {
    console.log("Semesters data is not available. Please try again.");
  }
})();
