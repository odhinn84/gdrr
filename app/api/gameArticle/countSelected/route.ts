import connectMongoDB from "@/lib/mongo/mongodb";
import GameArticle from "@/models/gameArticle";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();
        const selectedCount = await GameArticle.countDocuments({ selected: true });
        return NextResponse.json({ result: 'success', count: selectedCount });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}