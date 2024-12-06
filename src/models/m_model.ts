import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the Model document that extends mongoose's Document
export interface IModel extends Document {
    user_id: string;
    workspace_id: string;
    name: string;
    code: string;
}

// Create a schema for the Model model
const ModelSchema: Schema<IModel> = new Schema({
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
        default: "Just Another Model"
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
const XModel = mongoose.model<IModel>(COLLECTION_NAMES.models, ModelSchema);

export default XModel;