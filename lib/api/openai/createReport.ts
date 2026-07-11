type Document = {
  label: string;
  title?: string;
  content?: string;
}

type Section = {
  heading: string;
  content: string;
  citations: string[];
}

type Reference = {
  label: string;
  title: string;
}

export type Report = {
  title: string;
  introduction: string;
  sections: Section[];
  conclusion: string;
  references: Reference[];
}

export const initialReport: Report = {
  title: "",
  introduction: "",
  sections: [],
  conclusion: "",
  references: [],
}

export const systemPromptCreateReportOpenAI = `RAG 시스템에서 추출한 5개의 문서(기사 또는 논문)를 기반으로 전문 보고서를 작성하는 역할을 수행해야 합니다. 보고서는 제공된 예시 형식에 따라 작성되어야 하며, 각 문서의 주요 내용과 인용 정보를 통합하여 명확하고 체계적인 보고서를 만들어야 합니다.`

// export function userPromptCreateReportOpenAI(query: string, documents: Document[]) {
//     return `다음에 제공된 **논문 또는 기사 5개**를 바탕으로 요약된 보고서를 한글로 작성하세요.  
// 보고서는 연구 내용을 요약하고, 핵심 주제를 정리하며, 반드시 **JSON 형식**으로 출력해야 합니다.  

// [입력 쿼리]
// ${query}

// [주제 관련 기사 또는 논문]
// ${documents.map((document) => `${document.label}: ${document.title}
//     ${document.content}`).join("\n\n")}

// [응답 형식 예시]
// {
//   "report": {
//     "title": "[자동 생성된 보고서 제목]",
//     "introduction": "[논문과 기사의 주요 내용을 요약하고, 논의될 핵심 주제를 소개하세요.]",
//     "sections": [
//         {
//         "heading": "[첫 번째 주요 주제]",
//         "content": "[이 주제와 관련된 연구 결과 및 분석 내용을 요약하세요.]",
//         "citations": ["문서 label"]
//         },
//         {
//         "heading": "[두 번째 주요 주제]",
//         "content": "[관련 연구 결과 및 상반된 관점을 포함하여 설명하세요.]",
//         "citations": ["문서 label"]
//         },
//         {
//         "heading": "[세 번째 주요 주제]",
//         "content": "[추가적인 연구 결과 및 지원하는 논리를 포함하여 설명하세요.]",
//         "citations": ["문서 label"]
//         }
//     ],
//     "conclusion": "[논문과 기사에서 얻은 핵심 정보를 종합하고, 연구의 시사점 및 향후 연구 방향을 제시하세요.]",
//     "references": [
//         {
//         "label": "문서 1",
//         "title": "[논문 또는 기사 제목]",
//         },
//         {
//         "label": "문서 2",
//         "title": "[논문 또는 기사 제목]",
//         },
//         {
//         "label": "문서 3",
//         "title": "[논문 또는 기사 제목]",
//         },
//         {
//         "label": "문서 4",
//         "title": "[논문 또는 기사 제목]",
//         },
//         {
//         "label": "문서 5",
//         "title": "[논문 또는 기사 제목]",
//         }
//     ]
//     }
// }

// 상위 5개 문서의 주요 내용과 인용 정보를 반영하여 위와 같은 형식으로 보고서를 작성해 주세요.`
// }

// export function userPromptCreateReportOpenAI_v2(query: string, documents: Document[]) {
//   return `다음에 제공된 논문 또는 기사 5개를 바탕으로, [입력 쿼리]에 대한 구조화된 분석 보고서를 한글로 작성하세요. 보고서는 반드시 아래의 형식과 지침을 따르며, 최종 출력은 JSON 형식으로 작성하세요.

// 📌 [보고서 구성 지침]

// 1. **introduction**
//    - 입력 쿼리에 대한 **핵심적인 한 줄 요약 문장**으로 시작하세요.  
//      예: “게임은 사용자에게 공격적 감정을 유발할 수 있는 다양한 기제를 내포하고 있습니다.”
//    - 이어서, 검색된 문서들에 담긴 전체적인 내용을 간단히 정리하세요.  
//      (공통된 연구 방향, 주요 논의 대상, 전반적인 경향 등)

// 2. **sections** (최소 3개 이상)
//    - 각 section은 하나의 **핵심 주제를 제목**으로 설정하세요.  
//      예: “게임 승패와 정서 반응”, “사실적 입력기와 현실감”
//    - 본문은 **개조식 요약 형식**으로 작성하세요. 각 section에는 **2개 이상의 인용된 문헌 내용을 요약해 포함**해야 합니다.
//    - 각 인용은 **["문서 1", "문서 3"]**과 같이 citations 항목에 기록하세요.
//    - 문헌 내용을 그대로 요약하기보다는, **주제별로 연구 간 유사점·차이점 또는 상호작용 요인**을 중심으로 비교 분석하세요.

// 3. **conclusion**
//    - 본론에서 제시된 내용을 종합하여 **전체적인 시사점과 통합적 해석**을 작성하세요.
//    - 향후 연구 방향, 정책적 함의 등을 간략히 제시해도 좋습니다.

// 4. **references**
//    - 문서 목록은 ["문서 1", "문서 2", ..., "문서 5"] 형식으로, 각 문서의 제목과 함께 JSON 배열로 기입하세요.

// 📌 [JSON 출력 형식 예시]
// {
//   "report": {
//     "title": "[자동 생성된 보고서 제목]",
//     "introduction": "[한 줄 요약 + 전체 문헌 요약]",
//     "sections": [
//       {
//         "heading": "[핵심 주제 제목]",
//         "content": "- [개조식 인용 요약 1]\n- [개조식 인용 요약 2]",
//         "citations": ["문서 1", "문서 3"]
//       },
//       ...
//     ],
//     "conclusion": "[전체 시사점과 요약]",
//     "references": [
//       {
//         "label": "문서 1",
//         "title": "[문서 제목]"
//       },
//       ...
//     ]
//   }
// }

// 📌 [입력 쿼리 예시]
// ${query}

// 📌 [주제 관련 논문 또는 기사]
// ${documents.map((document) => `${document.label}: ${document.title}
//     ${document.content}`).join("\n\n")}
// `
// }

export function userPromptCreateReportOpenAI_v3(query: string, documents: Document[]) {
  return `다음에 제공된 논문 또는 기사 5개를 바탕으로, 아래에 명시된 **사용자 쿼리**에 대한 구조화된 분석 보고서를 한글로 작성하세요.  
보고서는 반드시 아래 형식과 지침을 따르며, 최종 출력은 **JSON 형식**으로 작성해야 합니다.

📌 [보고서 구성 지침]

1. **introduction**
   - 쿼리에 대한 **핵심적인 한 줄 요약 문장**으로 시작하세요.  
   - 이어서, 제공된 문헌의 전체적인 내용을 요약하고 공통된 경향을 간략히 설명하세요.

2. **sections** (최소 3개 이상)
   - 각 section은 하나의 **핵심 주제**를 제목으로 설정하세요.  
   - 본문은 **개조식 요약 형식**으로 작성하세요. 각 항목은 다음을 포함해야 합니다:

     ✅ **문장 내 인용 지침**
     - **문서 제목은 문장 중간에 직접 넣지 마세요.**
     - 인용 문서가 무엇인지 나타낼 때는 ‘한 보고서에 따르면’, ‘해당 연구는’, ‘이 논문에서는’ 등 간단한 지시어를 사용하세요.
     - 문장 끝에 **소괄호 ( )로 문서 제목을 명시**하세요.  
       예:  
       - 청소년을 위한 진로 체험 프로그램이 다수 운영되고 있다. (10주년 맞이한 '넥슨컴퓨터박물관'은 OOO이다!)
     - 같은 문서를 여러 번 인용할 경우, **첫 문장에만 제목 인용**, 이후는 ‘이 연구’ 또는 ‘같은 보고서’로 대체하세요.

3. **conclusion**
   - 본문의 내용을 바탕으로 핵심 시사점과 통합적 해석을 제시하세요.  
   - 정책적 함의, 향후 연구 방향 등을 간략히 제시해도 좋습니다.

4. **references**
   - 사용된 문서 목록을 "title" 기준으로 JSON 배열로 정리하세요.

📌 [JSON 출력 형식 예시]

{
  "report": {
    "title": "[자동 생성된 보고서 제목]",
    "introduction": "[한 줄 요약 + 전체 문헌 요약]",
    "sections": [
      {
        "heading": "[핵심 주제 제목]",
        "content": "- 한 보고서에 따르면, 게임 심의 기준이 모호하다는 비판이 제기된다. (게임물 등급분류제도의 개선방안에 관한 연구)\n- 같은 연구에서는 등급 거부 제도의 위헌 소지를 지적한다.",
        "citations": []
      }
    ],
    "conclusion": "[전체 시사점과 요약]",
    "references": [
      {
        "title": "게임물 등급분류제도의 개선방안에 관한 연구"
      }
    ]
  }
}

---

📌 [사용자 쿼리]

${query}

---

📌 [검색된 문헌 목록 및 요약 텍스트]

${documents.map((document) => `${document.label}: ${document.title}
    ${document.content}`).join("\n\n")}

※ 아래 형식으로 문헌들이 주어집니다. 각 문헌은 반드시 5개이며, 제목과 요약은 모두 포함됩니다.

예시:
- **<문서 제목 1>**  
  <요약 텍스트 1>

- **<문서 제목 2>**  
  <요약 텍스트 2>

...
`
}

export const createReportOpenAI = async (query: string, documents: Document[]) => {
  const response = await fetch("/api/openai/createReport", {
    method: "POST",
    body: JSON.stringify({
      query,
      documents
    }),
  });
  return response.json();
}

export const querySuggestSystemPrompt = `당신은 RAG 시스템에서 사용자의 짧은 키워드 입력을 받아, 의미 있는 학술적 질문으로 확장해주는 역할을 합니다.  
아래는 사용자가 입력한 짧은 쿼리입니다. 이 쿼리를 기반으로 **사회과학적 관점**에서 적절한 **의문문 형식의 질문**을 3가지 작성해주세요.  

- 질문은 명확하고 분석 가능해야 합니다.  
- 가능한 한 **논문, 보고서, 학술적 토론**에서 다룰 수 있을 정도로 구체적이고 명확한 문장으로 작성해주세요.  
- 각 질문은 다른 관점을 제시해주면 좋습니다 (예: 원인, 영향, 개입 방법 등).  
- 출력은 리스트 형식으로 주세요.

예시:

입력: 게임과 공격성  
출력:  
1. 아동의 게임 이용과 공격성 간의 관계는 무엇이며, 부모의 개입은 어떤 역할을 하는가?  
2. 과도한 게임 이용이 청소년의 공격성 증가로 이어지는 심리적 메커니즘은 무엇인가?  
3. 폭력적 게임과 비폭력적 게임이 공격적 행동에 미치는 차이는 무엇인가?`