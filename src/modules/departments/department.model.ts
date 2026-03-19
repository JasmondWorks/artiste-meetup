import mongoose, { Document, Schema } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  designations: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    designations: [{ type: String, required: true }],
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const DepartmentModel = mongoose.model<IDepartment>("Department", DepartmentSchema);
