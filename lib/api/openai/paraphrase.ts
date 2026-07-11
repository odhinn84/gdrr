import { getQueryParaphraseResponse } from "../gemini/paraphrase";

export const getQueryParaphraseOpenAI = async (query: string)
    : Promise<getQueryParaphraseResponse> => {
    return (await fetch("/api/openai/queryParaphrase", {
        method: "POST",
        body: JSON.stringify({ query }),
    })).json()
}

export const getQueryParaphraseListOpenAI = async (res: getQueryParaphraseResponse) => {
    if (res.result === "success") {
        // length max 4
        return res.paraphrases.slice(0, 10);
    } else {
        return [];
    }
}

export const getQuerySuggestionOpenAI = async (query: string) => {
    return (await fetch("/api/openai/querySuggest", {
        method: "POST",
        body: JSON.stringify({ query }),
    })).json()
}
