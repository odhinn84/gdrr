type EmbeddingResultArticle = {
    textType: "article"
    article_id: string
    similarity: number
}

type EmbeddingResultPaper = {
    textType: "paper"
    paper_id: string
    similarity: number
}

type EmbeddingResult = EmbeddingResultArticle | EmbeddingResultPaper

type EmbeddingResultList = EmbeddingResult[]

type Scores = {
    article: {
        [key: string]: number[]
    },
    paper: {
        [key: string]: number[]
    }
}
export type ScoreMaxResult = EmbeddingResult & {
    title?: string
    content?: string
    url?: string
}

export const getEmbeddingScoreMaxes = (embeddingResults: EmbeddingResultList) => {
    // Group scores by type and ID
    console.log(embeddingResults)
    const scores = embeddingResults.reduce((acc, result) => {
        const type = result.textType;
        const id = type === "article" ? result.article_id.toString() : result.paper_id;

        if (!acc[type][id]) {
            acc[type][id] = [];
        }
        acc[type][id].push(result.similarity);

        return acc;
    }, { article: {}, paper: {} } as Scores);

    // Convert grouped scores to final result format
    const scoreMaxResults = [
        ...Object.entries(scores.article).map(([id, similarities]) => ({
            textType: "article" as const,
            article_id: id,
            similarity: Math.max(...similarities)
        })),
        ...Object.entries(scores.paper).map(([id, similarities]) => ({
            textType: "paper" as const,
            paper_id: id,
            similarity: Math.max(...similarities)
        }))
    ] as ScoreMaxResult[]

    return scoreMaxResults.sort((a, b) => b.similarity - a.similarity).slice(0, 10)
}

