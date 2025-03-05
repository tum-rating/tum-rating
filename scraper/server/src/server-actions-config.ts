const TUM_ONLINE_SEMESTERS_URL = "https://campus.tum.de/tumonline/ee/rest/slc.lib.tm/semesters/student?$language="
const PRODUCTION_API_URL = "https://tum-rating.de/api/v1"
const PRODUCTION_API_COURSES_URL = PRODUCTION_API_URL + "/courses"
const TUM_CAMPUS_URL = " https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses"

const AI_MERGING_RULES = `
1.If the name is the same but one has advanced in it do not match courses.
Example input:
[
  "Advanced Qualitative Methods",
  "Qualitative Methods"
]
2.There is no match due to different level, so the output should be:
{
  "match": false,
  "name": "",
  "merged": []
}

3.If there are two courses that one is a continuation of the other - do not match them:
[
  "Building Structures 1",
  "Building Structures 2"
]
There is no match so the output should be:
{
  "match": false,
  "name": "",
  "merged": []
}

4.If there is a language in the name that is exactly the same match those courses:
Example input:
[
  "Commercial Criminal Law and Compliance (WI001222)",
  "Commercial Criminal Law and Compliance (WI001222, German)"
]
Match them, and give output:
{
  "match": true,
  "name": "Commercial Criminal Law and Compliance (WI001222)",
  "merged": [
    "Commercial Criminal Law and Compliance (WI001222)",
    "Commercial Criminal Law and Compliance (WI001222, German)"
  ]
}
As a nominal name use the base, so without German or other additions.

5. If there are some random words to the name that does not change the meaning of the course merge them:
Example input:
[
  "Commercial Criminal Law (WI001222)",
  "Commercial Criminal Law (WI001222) (Limited places)"
]
Merge them and output:
{
  "match": true,
  "name": "Commercial Criminal Law (WI001222)",
  "merged": [
    "Commercial Criminal Law (WI001222)",
    "Commercial Criminal Law (WI001222) (Limited places)"
  ]
}

6. If there are the same courses, but one is a lecture and other is exercise or tutorial or practical course merge them:
Example input:
[
  "Interaction Programming Block Course",
  "Interaction Programming Block Course Exercise",
  "Interaction Programming Block Course Tutorial",
  "Practical course Interaction Programming Block Course",
  "Interaction Prototyping Practical Course"
]
Output should be, "Interaction Prototyping Practical Course" is not matching:
{
  "match": true,
  "name": "Interaction Programming Block Course",
  "merged": [
    "Interaction Programming Block Course",
    "Interaction Programming Block Course Exercise",
    "Interaction Programming Block Course Tutorial",
    "Practical course Interaction Programming Block Course"
  ]
}

7. If there are some language courses with different levels, merge them:
Example input:
[
  "Japanese A1.1",
  "Japanese A1.2",
  "Japanese A2.1"
]
Merge them and give output:
{
  "match": true,
  "name": "Japanese A1.1 A1.2 A2.1",
  "merged": [
    "Japanese A1.1",
    "Japanese A1.2",
    "Japanese A2.1"
  ]
}
Place all the levels in the nominal name and remove all the addition like practical or intensive course.

8. If there are different values of SWS or other similar merge them removing this value:
Example input:
[
  "Advanced Research Course Brewing and Beverage Technology (12 SWS)",
  "Advanced Research Course Brewing and Beverage Technology (8 SWS)",
  "Advanced Research Course Brewing and Beverage Technology (4 SWS)",
  "Research Course Brewing and Beverage Technology (4 SWS)"
]
Merge them, but only advanced and give output:
{
  "match": true,
  "name": "Advanced Research Course Brewing and Beverage Technology",
  "merged": [
    "Advanced Research Course Brewing and Beverage Technology (12 SWS)",
    "Advanced Research Course Brewing and Beverage Technology (8 SWS)",
    "Advanced Research Course Brewing and Beverage Technology (4 SWS)"
  ]
}

9. If there are some names with codes and the names are corresponding to their meanings and previous rules match them:
Example input:
[
  "Quantum Computing (IN2107,IN2183,IN0014)",
  "Advanced Quantum Computing (IN2107,IN2183,IN0014)",
  "Quantum Computing Tutorial (IN2107,IN2183,IN0014,IN2190)"
]
Merge them, in the nominal name place all the values of those codes:
{
  "match": true,
  "name": "Quantum Computing (IN2107,IN2183,IN0014,IN2190)",
  "merged": [
    "Quantum Computing (IN2107,IN2183,IN0014)",
    "Quantum Computing Tutorial (IN2107,IN2183,IN0014,IN2190)"
  ]
}
`
export {
    TUM_ONLINE_SEMESTERS_URL,
    PRODUCTION_API_URL,
    PRODUCTION_API_COURSES_URL,
    TUM_CAMPUS_URL,
    AI_MERGING_RULES
}
