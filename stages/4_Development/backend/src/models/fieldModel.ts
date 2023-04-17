import { Schema, model } from "mongoose";
import { Field } from "../interfaces/interfaces";

const SchoolSchema = new Schema<Field>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide name for the task"],
    },
    name: {
      type: String,
      required: [true, "must provide name for the task"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model<Field>("Field", SchoolSchema);

export default SchoolModel;