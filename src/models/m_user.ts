import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTION_NAMES } from './_collection';

// Define an interface for the User document that extends mongoose's Document
export interface IUser extends Document {
    email: string;
    password_hash: string;
    display_name: string;
}

// Create a schema for the User model
const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    display_name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
});

// Exclude the password_hash field from the JSON response when the document is converted to JSON
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        // Delete the password_hash field from the result object
        delete ret.password_hash;
        return ret;
    },
});

// Create a Model from the schema
const User = mongoose.model<IUser>(COLLECTION_NAMES.users, userSchema);

export default User;