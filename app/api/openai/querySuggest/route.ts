import { querySuggestSystemPrompt } from "@/lib/api/openai/createReport";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const { query } = await req.json();
    const QueryList = z.object({
        queries: z.array(z.string()),
    });
    try {
        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            response_format: zodResponseFormat(QueryList, "query_list"),
            messages: [
                { role: "system", content: querySuggestSystemPrompt },
                {
                    role: "user",
                    content: query,
                },
            ],
        });
        const queryList = response.choices[0].message.parsed;
        console.log(queryList)
        return NextResponse.json({
            result: "success",
            queryList,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            result: "error",
            error: "Failed to paraphrase query"
        }, { status: 500 });
    }
}
