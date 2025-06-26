const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

function getApiKey() {
  const GROQ_API_KEYS = process.env.GROQ_API_KEY;
  const GROQ_API_KEY = GROQ_API_KEYS.split(',');
  return GROQ_API_KEY[Math.floor(Math.random() * GROQ_API_KEY.length)];
}

async function askAI(question) {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getApiKey()}`
  };
  const body = {
    "messages": [
      {
        "role": "user",
        "content": question
      }
    ],
    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  };
  try {
    const response = await axios.post(url, body, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error asking AI:", error);
    throw error;
  }
}

module.exports = askAI;