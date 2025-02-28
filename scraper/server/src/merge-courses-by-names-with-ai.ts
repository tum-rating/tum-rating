import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Logger from "./server-logger";
import { AI_MERGING_RULES } from "./server-actions-config";
import { WebSocketServer } from "ws";

dotenv.config();

type AiResponse = {
  match: boolean;
  name: string;
  merged: string[];
};

const logFilePath = path.join(__dirname, "aiLogs.json");

const logRequestResponse = (
  request: string[],
  response: any,
  wss?: WebSocketServer,
) => {
  console.log(1);
  const logEntry = {
    timestamp: new Date().toISOString(),
    request,
    response,
  };
  console.log(2);
  let logs = [];
  const logFilePath = path.join(__dirname, "aiLogs.json");
  // Read existing logs
  if (fs.existsSync(logFilePath)) {
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    if (fileContent) {
      logs = JSON.parse(fileContent);
    }
  }
  // Add new log entry
  logs.unshift(logEntry); // Add to beginning of array

  // Write logs to file
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

  // Broadcast to WebSocket clients if wss is provided
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "updateLogs",
            data: logs,
          }),
        );
      }
    });
  }
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

Return an array of results, one for each input set, in the following format:
[
  {
    "match": boolean,
    "name": string,
    "merged": string[]
  },
  // ... one object for each input set
]

Return only the output without reasoning.`;

const mergeCoursesByNamesWithAi = async (
  courses: string[] | string[][],
  wss?: WebSocketServer,
): Promise<AiResponse | AiResponse[]> => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ action: "aiRequestStarted" }));
      }
    });
  }
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
        model: "gpt-4o-mini",
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

    const aiResponse = JSON.parse(response.data.choices[0].message.content);

    console.log(aiResponse);
    logRequestResponse(courses, aiResponse);
    console.log(2);
    if (isBatch) {
      Logger.info(`Processed ${(courses as string[][]).length} course sets`);
    }

    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ action: "aiRequestFinished" }));
        }
      });
    }

    return aiResponse;
  } catch (error) {
    Logger.error(`Error in mergeCoursesByNamesWithAi: ${error.message}`);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export default mergeCoursesByNamesWithAi;
