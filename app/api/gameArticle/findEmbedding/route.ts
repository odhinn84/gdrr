import connectMongoDB from "@/lib/mongo/mongodb";
import Embedding from "@/models/embedding";
import { NextRequest, NextResponse } from "next/server";
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// const model = genAI.getGenerativeModel({ model: "text-embedding-004"});

export async function POST(req: NextRequest) {
    await connectMongoDB();

    const { embedding } = await req.json();

    const pipeline = [
        {
            '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': embedding,
                'numCandidates': 150,
                'limit': 20
            }
        }, {
            '$project': {
                '_id': 0,
                'article_id': 1,
                'textType': 1,
                'score': {
                    '$meta': 'vectorSearchScore'
                }
            }
        }
    ]

    const result = await Embedding.aggregate(pipeline);

    return NextResponse.json({ result });


}


// def get_embedding(text: str) -> List[float]:
//     genai.configure(api_key=os.environ["GEMINI_API_KEY"])
//     result = genai.embed_content(
//         model="models/text-embedding-004",
//         content=text)

//     return result['embedding']

// queryVector = get_embedding("사전 예약 시작 엔씨소프트가 신작 스위칭 역할수행게임(RPG) ‘호연’(사진)을 다음 달 28일 한국과 일본, 대만에 동시 출시한다.")

// # define pipeline
// pipeline = [
//   {
//     '$vectorSearch': {
//       'index': 'vector_index', 
//       'path': 'embedding', 
//       'queryVector': queryVector, 
//       'numCandidates': 150, 
//       'limit': 20
//     }
//   }, {
//     '$project': {
//       '_id': 0, 
//       'plot': 1, 
//       'title': 1, 
//       'score': {
//         '$meta': 'vectorSearchScore'
//       }
//     }
//   }
// ]

// # run pipeline
// result = client["gdrr"]["embeddings"].aggregate(pipeline)