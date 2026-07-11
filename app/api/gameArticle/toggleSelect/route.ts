import connectMongoDB from '@/lib/mongo/mongodb';
import GameArticle from '@/models/gameArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { _id, selected } = await req.json();
        const gameArticles = await GameArticle.findByIdAndUpdate(_id, { selected });
        return NextResponse.json({ result: 'success', gameArticles });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}