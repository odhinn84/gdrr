
type GAME_ARTICLE = {
    id: number;
    "제목": string;
    text: string;
    "URL": string;
}

export const getGameArticlesByIDs = async (ids: string[]) => {
    return fetch("/api/supabase/gameArticle/findManyByIDs", {
        method: "POST",
        body: JSON.stringify({ ids }),
    })
        .then((res) => res.json())
        .then((data) => {
            return data as { data: GAME_ARTICLE[] }
        });
}