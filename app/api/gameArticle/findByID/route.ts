import connectMongoDB from '@/lib/mongo/mongodb';
import GameArticle from '@/models/gameArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { id } = await req.json();
        const gameArticle = await GameArticle.findById(id);
        return NextResponse.json({ result: 'success', gameArticle });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}