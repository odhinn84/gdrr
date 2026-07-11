export type getQueryParaphraseResponseSuccess = {
    result: "success",
    paraphrases: string[],
}

export type getQueryParaphraseResponseError = {
    result: "error",
    error: string,
}

export type getQueryParaphraseResponse = getQueryParaphraseResponseSuccess | getQueryParaphraseResponseError;

export const systemPrompt = `너는 전문 검색 쿼리 확장 도구로 동작해야 합니다. 주어진 원본 쿼리의 의미를 최대한 유지하면서도, 관련 동의어, 연관 개념, 그리고 필요한 추가 설명을 포함하여 검색의 재현율을 높일 수 있도록 쿼리를 확장해야 합니다. 확장된 쿼리는 간결하면서도 효과적으로 다양한 관련 검색 결과를 도출할 수 있어야 합니다.
 
조건:
1. 원본 쿼리의 핵심 의미를 변형 없이 유지할 것.
2. 관련 분야의 동의어나 유의어, 연관 개념을 포함할 것.
3. 검색의 포괄성을 높이기 위해 필요한 구체적 용어나 설명을 첨가할 것.
4. 결과는 한 줄 또는 리스트 형식으로 제공할 것.`

export function userPrompt(query: string) {
    return `다음 원본 쿼리를 바탕으로 검색 범위를 확장할 수 있도록 관련 동의어, 연관 개념, 그리고 추가 설명을 포함한 확장 쿼리를 생성해 주세요.
 
원본 쿼리: “${query}”
 
조건:
1. 원본 쿼리의 의미를 유지할 것.
2. 관련 분야의 동의어나 비슷한 개념들을 포함할 것.
3. 검색의 재현율을 높이기 위해 필요한 추가 설명이나 구체적 용어를 첨가할 것.
4. 결과는 한 줄 또는 리스트 형식으로 제공할 것.
5. 10개 이상의 확장 쿼리를 생성할 것.

예시:
원본 쿼리: “인공지능 응용 사례”
확장 쿼리 결과(JSON 형식):
[
  "인공지능 응용 사례",
  "머신러닝 활용 사례",
  "AI 기술 적용 사례",
  "딥러닝 실생활 적용 예시"
]

확장된 쿼리를 작성해 주세요.`
}

export function userPromptOpenAI(query: string) {
    return `다음 원본 쿼리를 바탕으로 검색 범위를 확장할 수 있도록 관련 동의어, 연관 개념, 그리고 추가 설명을 포함한 확장 쿼리를 생성해 주세요.
 
원본 쿼리: “${query}”
 
조건:
1. 원본 쿼리의 의미를 유지할 것.
2. 관련 분야의 동의어나 비슷한 개념들을 포함할 것.
3. 검색의 재현율을 높이기 위해 필요한 추가 설명이나 구체적 용어를 첨가할 것.
4. 결과는 한 줄 또는 리스트 형식으로 제공할 것.
5. 10개 이상의 확장 쿼리를 생성할 것.

예시:
원본 쿼리: “인공지능 응용 사례”
확장 쿼리 결과(JSON 형식 - string list):
{
    "paraphrases": [
        "인공지능 응용 사례",
        "머신러닝 활용 사례",
        "AI 기술 적용 사례",
        "딥러닝 실생활 적용 예시"
    ]
}

확장된 쿼리를 작성해 주세요.`

}


export const getQueryParaphrase = async (query: string)
    : Promise<getQueryParaphraseResponse> => {
    return (await fetch("/api/gemini/queryParaphrase", {
        method: "POST",
        body: JSON.stringify({ query }),
    })).json()
}

export const getQueryParaphraseList = async (res: getQueryParaphraseResponse) => {
    if (res.result === "success") {
        // length max 4
        return res.paraphrases.slice(0, 10);
    } else {
        return [];
    }
}
