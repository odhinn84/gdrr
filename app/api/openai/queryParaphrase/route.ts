import { getQueryParaphraseResponse, systemPrompt, userPromptOpenAI } from "@/lib/api/gemini/paraphrase";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



export async function POST(req: NextRequest)
    : Promise<NextResponse<getQueryParaphraseResponse>> {
    const { query } = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: zodResponseFormat(z.object({
                paraphrases: z.array(z.string()),
            }), "paraphrases"),
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: userPromptOpenAI(query),
                },
            ],
        });
        console.log(response.choices[0].message.content)
        const paraphrasesJSON = JSON.parse(response.choices[0].message.content || "{}");
        const paraphrases = paraphrasesJSON.paraphrases;
        return NextResponse.json({
            result: "success",
            paraphrases,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            result: "error",
            error: "Failed to paraphrase query"
        }, { status: 500 });
    }
}