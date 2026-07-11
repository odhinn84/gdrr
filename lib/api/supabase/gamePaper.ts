type GAME_PAPER = {
    paper_id: string;
    title: string;
    abstract: string;
    url: string;
}

export const getGamePapersByIDs = async (ids: string[]) => {
    return fetch("/api/supabase/gamePaper/findManyByIDs", {
        method: "POST",
        body: JSON.stringify({ ids }),
    })
        .then((res) => res.json())
        .then((data) => {
            return data as { data: GAME_PAPER[] }
        });
}
