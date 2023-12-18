import { NextResponse } from "next/server";

export async function POST(req) {
  const OpenAI = require("openai");
  const { message } = await req.json();

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 150,
    });
    console.log("the response", response.choices[0].message);
    if (response && response.choices && response.choices[0]) {
      return NextResponse.json({ reply: response.choices[0].message.content });
    } else {
      console.error("Error: Choices not found in response");
      return NextResponse.json({ message: "Error processing your request" });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error processing your request" });
  }
}
