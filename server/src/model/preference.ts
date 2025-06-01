
import mongoose, { Schema } from "mongoose";
export interface IPreference  {
    name: string;
    createdAt: Date;
  }
const preferenceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export type  PreferenceDocument= IPreference& Document
const Preference = mongoose.model<PreferenceDocument>("Preference", preferenceSchema);
export default Preference;