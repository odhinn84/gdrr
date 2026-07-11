import { CreateReportResponse, systemPromptCreateReport, userPromptCreateReport } from "@/lib/api/gemini/createReport";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



export async function POST(req: NextRequest)
    : Promise<NextResponse<CreateReportResponse>> {
    const { contents } = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: systemPromptCreateReport },
                {
                    role: "user",
                    content: userPromptCreateReport(contents),
                },
            ],
        });
        const report = JSON.parse(response.choices[0].message.content || "[]");
        return NextResponse.json({
            result: "success",
            report,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            result: "error",
            error: "Failed to paraphrase query"
        }, { status: 500 });
    }
}