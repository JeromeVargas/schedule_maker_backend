import { Schema, model } from "mongoose";
import { School } from "../../typings/types";

const SchoolSchema = new Schema<School>(
  {
    name: {
      type: String,
      required: [true, "must provide name for the school"],
      unique: true,
    },
    groupMaxNumStudents: {
      type: Number,
      required: [true, "must provide a group number of students"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: [true, "Please provide a status for the school"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SchoolModel = model<School>("School", SchoolSchema);

export default SchoolModel;
