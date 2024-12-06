import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the LineHeader document that extends mongoose's Document
export interface ILineHeader extends Document {
    user_id: string;
    workspace_id: string;
    line_code: string;
    model_code: string;
    takt_time?: number;
    unit_per_hour?: number;
    total_cycle_time?: number;
}

// Create a schema for the LineHeader model
const LineHeaderSchema: Schema<ILineHeader> = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    workspace_id: {
        type: String,
        required: true,
    },
    line_code: {
        type: String,
        required: true,
    },
    model_code: {
        type: String,
        required: true,
    },
    takt_time: {
        type: Number,
        default: 0
    },
    unit_per_hour: {
        type: Number,
        default: 0
    },
    total_cycle_time: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create a Model from the schema
const LineHeader = mongoose.model<ILineHeader>(COLLECTION_NAMES.line_headers, LineHeaderSchema);

export default LineHeader;