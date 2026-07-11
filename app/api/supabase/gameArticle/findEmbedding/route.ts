import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";


export async function POST(req: NextRequest) {
    try {
        const { embedding } = await req.json();

        // console.log(embedding);
        // const embeddingString = JSON.stringify(embedding);

        // // Supabase에서 유사한 문서 검색
        // const { data, error } = await supabase
        //     .from("embeddings")
        //     .select(`
        //         article_id,
        //          1 - (embedding <=> ${embeddingString}) AS similarity
        //          `)
        //     .order("similarity", { ascending: false })
        //     .limit(20);
        const { data, error } = await supabase
            .rpc("find_article_embeddings", {
                query_embedding: embedding,
                match_threshold: 0,
                match_count: 10
            });

        if (error) {
            throw error;
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
