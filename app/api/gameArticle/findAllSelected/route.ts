import connectMongoDB from "@/lib/mongo/mongodb";
import GameArticle from "@/models/gameArticle";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongoDB();
        const gameArticles = await GameArticle.find({ selected: true });
        return NextResponse.json({ result: 'success', gameArticles });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}