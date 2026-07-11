import mongoose, { Schema } from 'mongoose';

const gamePaperSchema = new Schema(
    {
        title: String,
        url: String,
        abstract: String,
        keywords: [String],
        authors: [String],
        conference: [String],
        date: String,
        page: String,
        type: String,
        record: String,
        use_count: String,
    },
    {
        timestamps: true,
    }
);

const GamePaper =
    (mongoose.models && mongoose.models.game_papers) ||
    mongoose.model('game_papers', gamePaperSchema);

export default GamePaper;

