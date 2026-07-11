import connectMongoDB from '@/lib/mongo/mongodb';
import GameArticle from '@/models/gameArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { pageIdx, pageSize } = await req.json();
        const skip = (pageIdx - 1) * pageSize;
        const gameArticles = await GameArticle.find()
            .skip(skip).limit(pageSize);
        return NextResponse.json({ result: 'success', gameArticles });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}