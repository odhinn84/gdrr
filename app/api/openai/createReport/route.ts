import { systemPromptCreateReportOpenAI, userPromptCreateReportOpenAI_v3 } from "@/lib/api/openai/createReport";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    const { query, documents } = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: zodResponseFormat(z.object({
                report: z.object({
                    title: z.string(),
                    introduction: z.string(),
                    sections: z.array(z.object({
                        heading: z.string(),
                        content: z.string(),
                        citations: z.array(z.string()),
                    })),
                    conclusion: z.string(),
                    references: z.array(z.object({
                        label: z.string(),
                        title: z.string(),
                    })),
                })
            }), "report"),
            messages: [
                { role: "system", content: systemPromptCreateReportOpenAI },
                {
                    role: "user",
                    content: userPromptCreateReportOpenAI_v3(query, documents),
                },
            ],
        });
        console.log(response.choices[0].message.content)
        const reportJSON = JSON.parse(response.choices[0].message.content || "{}");
        const report = reportJSON.report;
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