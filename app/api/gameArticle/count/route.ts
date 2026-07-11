import connectMongoDB from "@/lib/mongo/mongodb";
import GameArticle from "@/models/gameArticle";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();
        const estimatedDocumentCount = await GameArticle.estimatedDocumentCount();
        return NextResponse.json({ result: 'success', count: estimatedDocumentCount });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}