import mongoose, { Schema, Types } from 'mongoose';

const embeddingSchema = new Schema(
    {
        "article_id": Types.ObjectId,
        "embedding": Array,
        "textType": String,
        "index": Boolean,
    },
    {
        timestamps: true,
    }
);

const Embedding =
    (mongoose.models && mongoose.models.embeddings) ||
    mongoose.model('embeddings', embeddingSchema);

export default Embedding;