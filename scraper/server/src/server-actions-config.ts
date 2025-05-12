const TUM_ONLINE_SEMESTERS_URL = "https://campus.tum.de/tumonline/ee/rest/slc.lib.tm/semesters/student?$language="
const PRODUCTION_API_URL = "https://tum-rating.de/api/v1"
const PRODUCTION_API_COURSES_URL = PRODUCTION_API_URL + "/courses"
const TUM_CAMPUS_URL = " https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses"

const AI_MERGING_RULES = `
Rule 1: Do Not Merge Sequential or Continuation Courses

Description: Courses that are sequential—typically indicated by a trailing numeral or explicit sequence marker (e.g., “1”, “2”, “Part I”, “Part II”)—must be treated as distinct.

Implementation:

First, scan each course name for a trailing number or sequential keyword.

If a course name includes such a marker, flag it as sequential and prevent any merge with another course that has a different sequential indicator.

Example:

Input: ["Analysis 1", "Analysis 2"]

Output: { "match": false, "name": "", "merged": [] }

Rule 2: No Matching When One Name Includes “Advanced” and the Other Does Not

Description: If two course names are identical except that one includes the term “Advanced” and the other does not, they must not be merged.

Example:

Input: ["Advanced Qualitative Methods", "Qualitative Methods"]

Output: { "match": false, "name": "", "merged": [] }

Rule 3: Do Not Merge Courses with Different Level Indicators

Description: If course names explicitly indicate different levels (e.g., “101” vs. “201”, or level descriptors like “Basic” vs. “Intermediate”), they should remain separate.

Example:

Input: ["Economics 101", "Economics 201"]

Output: { "match": false, "name": "", "merged": [] }

Rule 4: Merge Courses with Identical Language Additions

Description: If two course names differ only by a language specification enclosed in parentheses, they should be merged. Use the base course name (without the additional language) as the nominal name.

Example:

Input: ["Commercial Criminal Law and Compliance (WI001222)", "Commercial Criminal Law and Compliance (WI001222, German)"]

Output: { "match": true, "name": "Commercial Criminal Law and Compliance (WI001222)", "merged": ["Commercial Criminal Law and Compliance (WI001222)", "Commercial Criminal Law and Compliance (WI001222, German)"] }

Rule 5: Merge Courses with Extra Non-Essential Words

Description: If extra words (such as “Limited places”) are appended that do not change the core meaning of the course, merge them under the nominal base name.

Example:

Input: ["Commercial Criminal Law (WI001222)", "Commercial Criminal Law (WI001222) (Limited places)"]

Output: { "match": true, "name": "Commercial Criminal Law (WI001222)", "merged": ["Commercial Criminal Law (WI001222)", "Commercial Criminal Law (WI001222) (Limited places)"] }

Rule 6: Merge Variants of the Same Course (Lecture, Exercise, etc.)

Description: If variants of a course appear (e.g., lecture, exercise, tutorial, practical session), merge them as long as the core base name is the same. Variants that change the nominal base name significantly must not be merged.

Example:

Input: ["Interaction Programming Block Course", "Interaction Programming Block Course Exercise", "Interaction Programming Block Course Tutorial", "Practical course Interaction Programming Block Course", "Interaction Prototyping Practical Course"]

Output:

Merge the ones with the same core name:
{ "match": true, "name": "Interaction Programming Block Course", "merged": ["Interaction Programming Block Course", "Interaction Programming Block Course Exercise", "Interaction Programming Block Course Tutorial", "Practical course Interaction Programming Block Course"] }

Do not merge "Interaction Prototyping Practical Course" since its base name differs significantly.

Rule 7: Merge Language Courses with Different Levels

Description: For language courses that include level indicators (e.g., A1.1, A1.2, A2.1), merge them by concatenating all level designations into the nominal name. Remove any extraneous descriptors (e.g., “practical” or “intensive course”).

Example:

Input: ["Japanese A1.1", "Japanese A1.2", "Japanese A2.1"]

Output: { "match": true, "name": "Japanese A1.1 A1.2 A2.1", "merged": ["Japanese A1.1", "Japanese A1.2", "Japanese A2.1"] }

Rule 8: Merge Courses Differing Only by SWS Values

Description: When course names differ only by SWS (or similar credit) values, merge them by removing the SWS details. If both “Advanced” and non-advanced versions are present, only merge the advanced ones.

Example:

Input: ["Advanced Research Course Brewing and Beverage Technology (12 SWS)", "Advanced Research Course Brewing and Beverage Technology (8 SWS)", "Advanced Research Course Brewing and Beverage Technology (4 SWS)", "Research Course Brewing and Beverage Technology (4 SWS)"]

Output: { "match": true, "name": "Advanced Research Course Brewing and Beverage Technology", "merged": ["Advanced Research Course Brewing and Beverage Technology (12 SWS)", "Advanced Research Course Brewing and Beverage Technology (8 SWS)", "Advanced Research Course Brewing and Beverage Technology (4 SWS)"] }

Rule 9: Merge Courses with Codes

Description: If course names include codes and satisfy the other matching rules, merge them and include all unique codes in the nominal name.

Example:

Input: ["Quantum Computing (IN2107,IN2183,IN0014)", "Advanced Quantum Computing (IN2107,IN2183,IN0014)", "Quantum Computing Tutorial (IN2107,IN2183,IN0014,IN2190)"]

Output: { "match": true, "name": "Quantum Computing (IN2107,IN2183,IN0014,IN2190)", "merged": ["Quantum Computing (IN2107,IN2183,IN0014)", "Quantum Computing Tutorial (IN2107,IN2183,IN0014,IN2190)"] }

Rule 10: Do Not Merge Courses with Distinct Subject Matter

Description: Courses that share common words but cover distinct subject areas must not be merged. This is especially important for topics like mathematics where similar terms (e.g., “Algebra” vs. “Linear Algebra”) refer to different subjects.

Example:

Input:

Algebra group:
["Algebra (Exercise Session) [MA2010]", "Algebra (Questions Session) [MA2010]", "Algebra 2 [MA5120]", "Algebra [MA2010]", "Exercises for Algebra 2 [MA5120]"]

Linear Algebra group:
["Linear Algebra 1 (Central Exercise Session) [MA0004]", "Linear Algebra 1 (Exercise Session) [MA0004]", "Linear Algebra 1 [MA0004]", "Linear Algebra for Informatics [MA0901]", "Linear Algebra for Informatics (Exercise Session) [MA0901]"]

Output:

Algebra courses merged into one group:
{ "match": true, "name": "Algebra [MA2010, MA5120]", "merged": [/* all Algebra courses */] }

Linear Algebra courses merged into a separate group:
{ "match": true, "name": "Linear Algebra [MA0004, MA0901]", "merged": [/* all Linear Algebra courses */] }`
export {
    TUM_ONLINE_SEMESTERS_URL,
    PRODUCTION_API_URL,
    PRODUCTION_API_COURSES_URL,
    TUM_CAMPUS_URL,
    AI_MERGING_RULES
}
