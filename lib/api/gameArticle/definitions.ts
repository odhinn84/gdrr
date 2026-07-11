import { DataColsKeys } from "./type";


export const initialDataCols: Record<DataColsKeys, boolean> = {
    "뉴스 식별자": true,
    "일자": true,
    "언론사": true,
    "기고자": true,
    "제목": true,
    "통합 분류1": true,
    "통합 분류2": false,
    "통합 분류3": false,
    "사건/사고 분류1": true,
    "사건/사고 분류2": false,
    "사건/사고 분류3": false,
    "인물": true,
    "위치": true,
    "기관": true,
    "키워드": true,
    "특성추출(가중치순 상위 50개)": true,
    "본문": true,
    "URL": true,
    "분석제외 여부": false,
    "text": true,
} 