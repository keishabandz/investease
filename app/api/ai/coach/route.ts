import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY =
  process.env.OPEN_AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null;

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const learnerProfile = body?.learnerProfile ?? null;
    const nextLessons = Array.isArray(body?.nextLessons) ? body.nextLessons : [];

    if (!learnerProfile || nextLessons.length === 0) {
      return NextResponse.json(
        { error: "learnerProfile and nextLessons are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an investing learning coach. Provide concise educational guidance only.
Learner profile: ${JSON.stringify(learnerProfile)}
Next lessons: ${JSON.stringify(nextLessons)}
Return JSON with keys: headline, summary, nextStep.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You provide practical learning guidance for investing education. Do not provide personalized financial advice.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "OpenAI request failed", details },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const raw = payload?.choices?.[0]?.message?.content;
    const parsed =
      typeof raw === "string"
        ? JSON.parse(raw)
        : {
            headline: "AI Coach",
            summary: "No coaching summary available.",
            nextStep: "",
          };

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate coaching guidance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
