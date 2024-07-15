import axios from "axios";
import fs from "fs";
import ora from "ora";
import cliProgress from "cli-progress";

const baseUrl =
  "https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses";

const fetchPage = async (page, options) => {
  const { pageSize, termId } = options;
  const queryParams = `$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf`;
  const skip = (page - 1) * pageSize;
  const xmlUrl = `${baseUrl}?${queryParams}&$skip=${skip}&$top=${pageSize}`;

  try {
    const response = await axios.get(xmlUrl);
    return response.data.resource;
  } catch (error) {
    console.error("Error fetching XML data:", error);
    return [];
  }
};

const fetchAllPages = async (options) => {
  let { totalPages = 350, termId, pageSize } = options;
  const allCourses = [];
  const semesters = JSON.parse(fs.readFileSync("semesters.json", "utf8"));
  const semesterName = semesters[termId];
  const progressBar = new cliProgress.SingleBar(
    {
        format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Fetching {semester} ...`,
    },
    cliProgress.Presets.shades_classic,
  );
  return await getNumberOfPages({
    pageSize,
    termId,
    totalPages,
  }).then(async (numberOfPages) => {
    const allCourses = [];
    progressBar.start(numberOfPages, 0, { semester: semesterName })

    for (let page = 1; page <= numberOfPages; page++) {
      progressBar.update(page, { semester: semesterName });
      await fetchPage(page, options).then((data) => {
        allCourses.push(...data);
      });
    }

    progressBar.stop({
      text: `Fetched ${allCourses.length} courses for ${semesterName}`,
    });
    return allCourses;
  });
};

const summariesFn = async (courses) => {
  return courses.map((course) => {
    const courseId = course.content.cpCourseDto.id;
    const courseTitleTranslations =
      course.content.cpCourseDto.courseTitle.translations.translation.reduce(
        (acc, translation) => {
          acc[translation.lang] = translation.value;
          return acc;
        },
        {},
      );

    const semester = course.content.cpCourseDto.semesterDto.shortName.value;
    const semesterId = course.content.cpCourseDto.id;
    const mainLecturers = [];
    const otherLecturers = [];

    course.content.cpCourseDto.lectureships.forEach((lecturer, index) => {
      const firstName = lecturer.identityLibDto.firstName;
      const lastName = lecturer.identityLibDto.lastName;
      const lecturerName = `${firstName} ${lastName}`;
      const lecturerInfo = {
        name: lecturerName,
        businessCardLink: lecturer.identityLibDto.businessCardLink
          ? lecturer.identityLibDto.businessCardLink.href
          : null,
      };
      if (
        lecturer.teachingFunction.key === "L" ||
        (index === 0 && mainLecturers.length === 0)
      ) {
        mainLecturers.push(lecturerInfo);
      } else {
        otherLecturers.push(lecturerInfo);
      }
    });

    return {
      courseId,
      courseNumber: course.content.cpCourseDto.courseNumber,
      courseTitleTranslations,
      mainLecturers,
      otherLecturers,
      semester,
      semesterId,
    };
  });
};

const fetchSemestersList = async () => {
  const url =
    "https://campus.tum.de/tumonline/ee/rest/slc.lib.tm/semesters/student?$language=";
  try {
    const response = await axios.get(url);
    const semesters = response.data.semesters;
    const semesterMap = semesters.reduce((acc, semester) => {
      const id = semester.id;
      const name = semester.shortName.value;
      acc[id] = name;
      return acc;
    }, {});
    fs.writeFileSync(
      "semesters.json",
      JSON.stringify(semesterMap, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error("Error fetching or processing semesters data:", error);
  }
};

const getNumberOfPages = async ({ pageSize, termId }) => {
  const url = `https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses?$filter=courseNormKey-eq=LVEAB;orgId-eq=1;termId-eq=${termId}&$orderBy=title=ascnf&$skip=0&$top=${pageSize}`;
  const totalCount = axios.get(url).then((response) => {
    return response.data.totalCount;
  });
  return axios.get(url).then((response) => {
    const totalCount = response.data.totalCount;
    return Math.ceil(totalCount / pageSize);
  });
};

export { fetchAllPages, summariesFn, fetchSemestersList };
