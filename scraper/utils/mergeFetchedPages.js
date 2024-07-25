import fs from "fs";
import cliProgress from "cli-progress";

const mergeFetchedPages = async (filesToMerge) => {
  const progressBar = new cliProgress.SingleBar(
    {
      format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Merging ...`,
    },
    cliProgress.Presets.shades_classic,
  );

  console.log(filesToMerge);
  const allData = filesToMerge.reduce((acc, file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    acc = [...acc, ...data];
    return acc;
  }, []);

  const mergedCourses = {};

  progressBar.start(allData.length, 0);

  allData.forEach((course, index) => {
    progressBar.update(index);
    const courseTitle = course.courseTitle.replace(/\t/g, "");
    const mainLecturer =
      course.mainLecturers.length > 0 ? course.mainLecturers[0].name : "";
    const key = `${courseTitle}-${mainLecturer}`;
    if (mergedCourses[key]) {
      if (!mergedCourses[key].semester.includes(course.semester[0]))
        mergedCourses[key].semester.push(course.semester[0]);
    } else {
      mergedCourses[key] = { ...course, courseTitle };
    }
  });

  const mergedData = Object.values(mergedCourses);
  progressBar.stop({
    text: `Merged ${mergedData.length} courses`,
  });
  return mergedData;
};

export { mergeFetchedPages };
