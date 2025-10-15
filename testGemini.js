import fetch from "node-fetch";

const API_KEY = "AIzaSyAzP0-AFrmqPJyZtQOT1sTGSg0bJiEMzCg";

async function testGemini() {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Explain how AI works in a few words",
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testGemini();
