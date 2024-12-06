import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the Workspace document that extends mongoose's Document
export interface IWorkspace extends Document {
    user_id: string;
    name: string;
}

// Create a schema for the Workspace model
const WorkspaceSchema: Schema<IWorkspace> = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        default: "Just Another Workspace"
    },
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create a Model from the schema
const Workspace = mongoose.model<IWorkspace>(COLLECTION_NAMES.workspaces, WorkspaceSchema);

export default Workspace;