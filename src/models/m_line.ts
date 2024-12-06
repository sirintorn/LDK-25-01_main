import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the Line document that extends mongoose's Document
export interface ILine extends Document {
    user_id: string;
    workspace_id: string;
    name: string;
    code: string;
}

// Create a schema for the Line model
const LineSchema: Schema<ILine> = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    workspace_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        default: "Just Another Line"
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create a Model from the schema
const Line = mongoose.model<ILine>(COLLECTION_NAMES.lines, LineSchema);

export default Line;