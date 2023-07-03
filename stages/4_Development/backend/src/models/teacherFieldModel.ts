import { Schema, model } from "mongoose";
import { Teacher_Field } from "../typings/types";

const SchoolSchema = new Schema<Teacher_Field>(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "must provide name for the task"],
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "must provide name for the task"],
    },
    field_id: {
      type: Schema.Types.ObjectId,
      required: [true, "must provide name for the task"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model<Teacher_Field>("Teacher_Field", SchoolSchema);

export default SchoolModel;
