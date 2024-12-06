import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the LineDetail document that extends mongoose's Document
export interface ILineDetail extends Document {
    user_id: string;
    workspace_id: string;
    line_header_id: string;
    cycle_time: number;
    description?: string;
    employee?: string;
    station: string;
    step_code: string;
}

// Create a schema for the LineDetail model
const LineDetailSchema: Schema<ILineDetail> = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    workspace_id: {
        type: String,
        required: true,
    },
    line_header_id: {
        type: String,
        required: true,
    },
    cycle_time: {
        type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
    },
    employee: {
        type: String,
    },
    station: {
        type: String,
        required: true
    },
    step_code: {
        type: String,
        required: true
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create a Model from the schema
const LineDetail = mongoose.model<ILineDetail>(COLLECTION_NAMES.line_details, LineDetailSchema);

export default LineDetail;