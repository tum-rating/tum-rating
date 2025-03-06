import axios from "axios";
import dotenv from "dotenv";
import Logger from "./server-logger";
import { AI_MERGING_RULES } from "./server-actions-config";
import { WebSocketServer } from "ws";
import { aiWorkers } from "./websocket-handlers";
import fs from "fs";
import path from "path";

dotenv.config();

export type AiResponse = {
  match: boolean;
  name: string;
  merged: string[];
};

const logRequestResponse = (
  request: string[],
  response: any,
  fileName: string,
  wss?: WebSocketServer,
  error?: string
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    request,
    response,
    error,
  };

  if (aiWorkers[fileName]) {
    aiWorkers[fileName].logs.unshift(logEntry);
  } else {
    aiWorkers[fileName] = {
      userId: "",
      progress: 0,
      startTime: new Date().toISOString(),
      status: "in-progress",
      logs: [logEntry],
    };
  }

  const aiLogsPath = path.join(__dirname, "../data/aiLogs.json");
  let aiLogs = [];
  if (fs.existsSync(aiLogsPath)) {
    aiLogs = JSON.parse(fs.readFileSync(aiLogsPath, "utf-8"));
  }
  aiLogs.unshift(logEntry);
  fs.writeFileSync(aiLogsPath, JSON.stringify(aiLogs, null, 2), "utf-8");
};

const getSingleCoursePrompt = (courses: string[]) => `
You will receive name of university courses in a form of nominal name and following possible matches that might be a course duplicate. The input structure is a following JSON:
Data to merge:
${JSON.stringify(courses, null, 2)}
First element is always a nominal name, and the rest are possible matches.

Apply the following rules to determine if courses should be merged:

${AI_MERGING_RULES}

Return the result in the following format:
{
  "match": boolean,
  "name": string,
  "merged": string[]
}

Return only the output without reasoning.`;

const getBatchPrompt = () => `
You will receive multiple sets of university courses in the form of nominal names and possible matches that might be duplicates. The input structure is a JSON array of arrays, where each inner array represents a separate case to analyze:
[
  ["nominal_name1", "possible_match1", "possible_match2"],
  ["nominal_name2", "possible_match3", "possible_match4"]
]
First element in each inner array is always a nominal name, and the rest are possible matches.

Apply the following rules to each set independently:

${AI_MERGING_RULES}

Return an array of objects results, one for each input set, in the following format (Do not wrap the json codes in JSON markers):

[
  {
    "match": boolean,
    "name": string,
    "merged": string[]
  },
  // ... one object for each input set
]

Return only the output without reasoning.`;

const cleanJsonString = (jsonString: string): string => {
  const pattern = /^```json\s*(.*?)\s*```$/s;
  const cleanedString = jsonString.replace(pattern, '$1');
  return cleanedString.trim();
};

const mergeCoursesByNamesWithAi = async (
  courses: string[] | string[][],
  wss?: WebSocketServer,
  fileName: string
): Promise<AiResponse | AiResponse[]> => {
  const isBatch = Array.isArray(courses[0]);
  Logger.info(
    `Processing ${isBatch ? "batch" : "single"} course merge request`,
  );

  try {
    const prompt = isBatch
      ? getBatchPrompt()
      : getSingleCoursePrompt(courses as string[]);

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content:
              prompt +
              (isBatch
                ? `\nData to merge:\n${JSON.stringify(courses, null, 2)}`
                : ""),
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );

    const cleanedResponse = cleanJsonString(response.data.choices[0].message.content);
    const aiResponse = JSON.parse(cleanedResponse);

    logRequestResponse(courses, aiResponse, fileName, wss);
    if (isBatch) {
      Logger.info(`Processed ${(courses as string[][]).length} course sets`);
    }

    return aiResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(`Error in mergeCoursesByNamesWithAi: ${errorMessage}`);
    logRequestResponse(courses, null, fileName, wss, errorMessage);
    throw new Error(errorMessage);
  }
};

export default mergeCoursesByNamesWithAi;