import mongoose, { Schema } from 'mongoose';

const gameArticleSchema = new Schema(
    {
        "뉴스 식별자": String,
        "일자": String,
        "언론사": String,
        "기고자": String,
        "제목": String,
        "통합 분류1": String,
        "통합 분류2": String,
        "통합 분류3": String,
        "사건/사고 분류1": String,
        "사건/사고 분류2": String,
        "사건/사고 분류3": String,
        "인물": String,
        "위치": String,
        "기관": String,
        "키워드": String,
        "특성추출(가중치순 상위 50개)": String,
        "본문": String,
        "URL": String,
        "분석제외 여부": String,
        "text": String,
        "selected": Boolean,
    },
    {
        timestamps: true,
    }
);

const GameArticle =
    (mongoose.models && mongoose.models.game_articles) ||
    mongoose.model('game_articles', gameArticleSchema);

export default GameArticle;