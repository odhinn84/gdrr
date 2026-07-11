export type GameArticle = {
    "_id": string;
    "뉴스 식별자": string;
    "일자": string;
    "언론사": string;
    "기고자": string;
    "제목": string;
    "통합 분류1": string;
    "통합 분류2": string;
    "통합 분류3": string;
    "사건/사고 분류1": string;
    "사건/사고 분류2": string;
    "사건/사고 분류3": string;
    "인물": string;
    "위치": string;
    "기관": string;
    "키워드": string;
    "특성추출(가중치순 상위 50개)": string;
    "본문": string;
    "URL": string;
    "분석제외 여부": string;
    "text": string;
    "selected": boolean;
}

export type DataColsKeys = keyof Omit<GameArticle, "_id" | "selected">;