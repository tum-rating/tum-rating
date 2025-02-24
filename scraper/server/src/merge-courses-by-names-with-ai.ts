import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const mergeCoursesByNamesWithAi = async (courses: string[]): Promise<any> => {
  const prompt = `
You are an expert in processing and merging university course names.
Apply the following rules:
1. If one course includes "Advanced" and the other doesn't, do not merge.
2. If one course is a numbered continuation (e.g., "Building Structures 1" vs. "Building Structures 2"), do not merge.
3. If there is a language specified in the name (e.g., "German"), merge them and use the base name.
4. Minor additional words that don't change the meaning (e.g., "Limited places") should be merged.
5. Lecture, exercise, or tutorial variations should be merged.
6. For language courses with different levels, merge them and list all levels in the nominal name.
7. Remove differences in values such as SWS.
8. For courses with codes, merge them and include all unique codes.
Return the result as JSON with this structure:
{
  "match": <true/false>,
  "name": "<Nominal course name if merged>",
  "merged": [<List of merged course names>]
}

Process the following input:
${JSON.stringify(courses, null, 2)}
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
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

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export default mergeCoursesByNamesWithAi;