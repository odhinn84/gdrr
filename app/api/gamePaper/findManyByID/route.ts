import connectMongoDB from '@/lib/mongo/mongodb';
import GamePaper from '@/models/gamePaper';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { ids } = await req.json();
        const gamePapers = await GamePaper.find({ _id: { $in: ids } });
        return NextResponse.json({ result: 'success', gamePapers });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ result: 'failed', error });
    }
}