export const getEmbedding = async (text: string) => {
    const response = await fetch(`/api/gemini/embedding?text=${text}`);
    const data = await response.json();
    return data;
}

export const getEmbeddingOpenAI = async (text: string) => {
    const response = await fetch(`/api/openai/embedding?text=${text}`);
    const data = await response.json();
    return data;
}

export const findEmbedding = async (embedding: number[]) => {
    const response = await fetch(`/api/gameArticle/findEmbedding`, {
        method: 'POST',
        body: JSON.stringify({ embedding }),
    });
    const data = await response.json();
    return data;
}

export const findEmbeddingSupabase = async (embedding: number[]) => {
    const response = await fetch(`/api/supabase/gameArticle/findEmbedding`, {
        method: 'POST',
        body: JSON.stringify({ embedding }),
    });
    const data = await response.json();
    return data;
}

export const findEmbeddingTotalSupabase = async (embedding: number[], threshold: number, count: number) => {
    const response = await fetch(`/api/supabase/gameArticle/findEmbedding/total`, {
        method: 'POST',
        body: JSON.stringify({ embedding, threshold, count }),
    });
    const data = await response.json();
    return data;
}

export const findEmbeddingArticlesSupabase = async (embedding: number[], threshold: number, count: number) => {
    const response = await fetch(`/api/supabase/gameArticle/findEmbedding/articles`, {
        method: 'POST',
        body: JSON.stringify({ embedding, threshold, count }),
    });
    const data = await response.json();
    return data;
}

export const findEmbeddingPapersSupabase = async (embedding: number[], threshold: number, count: number) => {
    const response = await fetch(`/api/supabase/gameArticle/findEmbedding/papers`, {
        method: 'POST',
        body: JSON.stringify({ embedding, threshold, count }),
    });
    const data = await response.json();
    return data;
}