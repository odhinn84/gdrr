import { supabase } from "@/lib/supabase/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { ids } = await req.json();
    console.log(ids)
    const { data, error } = await supabase
        .from("game_papers")
        .select("*")
        .in("paper_id", ids);

    if (error) {
        return NextResponse.json({ result: 'error', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ result: 'success', data });
}