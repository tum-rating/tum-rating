import axios from 'axios';
import dotenv from 'dotenv';
import path from "path";
import fs from "fs";
import { Logger } from './logger';

dotenv.config();

type AiResponse = {
    match: boolean;
    name: string;
    merged: string[];
};

const logFilePath = path.join(__dirname, 'aiLogs.json');

const logRequestResponse = (request: any, response: any) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        request,
        response
    };
    let logs = [];
    if (fs.existsSync(logFilePath)) {
        logs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
    }
    logs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
};

const getSingleCoursePrompt = (courses: string[]) => `
You will receive name of university courses in a form of nominal name and following possible matches that might be a course duplicate, the input structure is a following JSON:
Data to merge:
${JSON.stringify(courses, null, 2)}
First element is always a nominal name, and the rest are possible matches.
You want to return the names from the merge that are actually matching according to the rules:
If the name is the same but one has advanced in it do not match courses.
Example input:
[
  "Advanced Qualitative Methods",
  "Qualitative Methods"
]
There is no match due to different level, so the output should be:
{
  "match": false,
  "name": "",
  "merged": []
}

If there are two courses that one is a continuation of the other - do not match them:
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

If there is a language in the name that is exactly the same match those courses:
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

4. If there are some random words to the name that does not change the meaning of the course merge them:
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

5. If there are the same courses, but one is a lecture and other is exercise or tutorial or practical course merge them:
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

6. If there are some language courses with different levels, merge them:
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

7. If there are different values of SWS or other similar merge them removing this value:
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

8. If there are some names with codes and the names are corresponding to their meanings and previous rules match them:
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
Now based on those rules combined and common sense perform merge for, return only the output without reasoning.`;

const getBatchPrompt = () => `
You will receive multiple sets of university courses in the form of nominal names and possible matches that might be duplicates. Each set is a separate case. The input structure is a JSON array of arrays:
[
  ["name1", "name2", "name3"],
  ["name4", "name5", "name6"]
]
Each inner array represents a separate case to analyze.

For each set, return the merged result according to the rules:
1. If the name is the same but one has "advanced" in it, do not match courses.
2. If there are two courses that one is a continuation of the other, do not match them.
3. If there is a language in the name that is exactly the same, match those courses.
4. If there are some random words in the name that do not change the meaning of the course, merge them.
5. If there are the same courses, but one is a lecture and the other is an exercise or tutorial or practical course, merge them.
6. If there are language courses with different levels, merge them.
7. If there are different values of SWS or other similar values, merge them, removing this value.
8. If there are names with codes and the names correspond to their meanings and previous rules, match them.

Return the results as an array of objects, each containing:
{
  "match": boolean,
  "name": string,
  "merged": string[]
}`;

const mergeCoursesByNamesWithAi = async (courses: string[] | string[][]): Promise<AiResponse | AiResponse[]> => {
    const isBatch = Array.isArray(courses[0]);
    Logger.info(`Processing ${isBatch ? 'batch' : 'single'} course merge request`);

    try {
        const prompt = isBatch ? getBatchPrompt() : getSingleCoursePrompt(courses as string[]);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: prompt + (isBatch ? `\nData to merge:\n${JSON.stringify(courses, null, 2)}` : '')
                }],
                max_tokens: 1000,
                temperature: 0.2
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const aiResponse = JSON.parse(response.data.choices[0].message.content);
        logRequestResponse(courses, aiResponse);

        if (isBatch) {
            Logger.info(`Processed ${(courses as string[][]).length} course sets`);
        }

        return aiResponse;
    } catch (error) {
        Logger.error(`Error in mergeCoursesByNamesWithAi: ${error.message}`);
        throw new Error(error.response ? error.response.data : error.message);
    }
};

export default mergeCoursesByNamesWithAi;