import axios from 'axios';
import dotenv from 'dotenv';
import path from "path";
import fs from "fs";

dotenv.config();

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
    } else {
        fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
    }
    logs.push(logEntry);
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
};

const mergeCoursesByNamesWithAi = async (courses: string[]): Promise<any> => {
    console.log(courses);
    const prompt = `
You will receive name of university courses in a form of nominal name and following possible matches that might be a course duplicate, the input structure is a following JSON:
[
  "name",
  "name second",
  "name third"
]
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
Now based on those rules combined and common sense perform merge for, return only the output without reasoning.
`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini",
                messages: [{role: "user", content: prompt}],
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
        console.log(aiResponse,"<----ai response")
        logRequestResponse(courses, aiResponse);
        return aiResponse;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

export default mergeCoursesByNamesWithAi;