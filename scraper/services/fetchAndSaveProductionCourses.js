import fs from 'fs';
import cliProgress from 'cli-progress';
import axios from 'axios';
import config from '../config.js';
import path from "path";

const fetchAndSaveProductionCourses = async () => {
  const progressBar = new cliProgress.SingleBar(
    {
      format: `{bar} || {percentage}% || {value}/? || ETA: {eta}s || Fetching ...`,
    },
    cliProgress.Presets.shades_classic,
  );

  let allCourses = [];
  let pageNumber = 1;
  const pageSize = 500;
  let totalCourses = 0;

  progressBar.start(100, 0); // Initial progress bar setup

  while (pageNumber) {
    const response = await axios.get(`https://tum-rating.de/api/v1/courses?page-number=${pageNumber}&page-size=${pageSize}`);
    const data = response.data;
    allCourses.push(...data.results)
    totalCourses += data.results.length;
    progressBar.update(totalCourses);
    pageNumber = data.nextPageNumber;
  }

  progressBar.stop();

  const dirPath = config.PROD_DB_COURSES_DIR;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'courses.json');
  fs.writeFileSync(filePath, JSON.stringify(allCourses, null, 2), 'utf8');
  console.log(`Fetched and saved ${totalCourses} courses to ${filePath}`);
};

export { fetchAndSaveProductionCourses };