import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";


export async function POST(req: NextRequest) {
    try {
        const { embedding, threshold, count } = await req.json();

        const { data, error } = await supabase
            .rpc("find_paper_embeddings", {
                query_embedding: embedding,
                match_threshold: threshold,
                match_count: count
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
