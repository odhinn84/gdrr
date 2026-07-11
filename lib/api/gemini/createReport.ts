export type Theme = {
    theme: string;
    summary1: string;
    summary2: string;
}

export type CreateReportResponseSuccess = {
    result: "success",
    report: Theme[];
}

export type CreateReportResponseError = {
    result: "error",
    error: string;
}

export type CreateReportResponse = CreateReportResponseSuccess | CreateReportResponseError;

export const systemPromptCreateReport = `너는 RAG 시스템에서 추출한 5개의 문서(기사 또는 논문)를 기반으로 전문 보고서를 작성하는 역할을 수행해야 합니다. 보고서는 제공된 예시 형식에 따라 작성되어야 하며, 각 문서의 주요 내용과 인용 정보를 통합하여 명확하고 체계적인 보고서를 만들어야 합니다.

조건:
1. 주제는 2개로 요약할 것.
2. 이어서 주요 주제별로 세부 섹션을 구성하고, 각 섹션에는 관련 문서의 정보를 반영한 핵심 내용을 포함할 것.
3. 보고서 내 인용은 원 문서의 정보를 충실히 반영하고, 신뢰성 있는 내용을 제공할 것.
4. 전체 보고서는 일관된 문체와 체계적인 구성으로 작성되어야 하며, 제공된 형식 예시와 최대한 부합하도록 작성할 것.
`

export function userPromptCreateReport(contents: string[]) {
    return `아래에 제공된 RAG 상위 5개 문서(기사 또는 논문)를 바탕으로 보고서를 작성해 주세요. 보고서는 아래 예시와 동일한 형식으로 작성되어야 합니다.

    제공된 문서는 아래와 같습니다.
    ${contents.map((content, index) => `문서 ${index + 1}: ${content}`).join("\n\n")}

[형식 예시]
[
    {
        "theme": "",
        "summary1": "",
        "summary2": ""
    },
    {
        "theme": "",
        "summary1": "",
        "summary2": ""
    },   
]

상위 5개 문서의 주요 내용과 인용 정보를 반영하여 위와 같은 형식으로 보고서를 작성해 주세요.`
}


export const createReport = async (contents: string[]) => {
    const response = await fetch("/api/gemini/createReport", {
        method: "POST",
        body: JSON.stringify({ contents }),
    });
    return response.json();
}

// export const getFormedReport = (report: CreateReportResponse) => {