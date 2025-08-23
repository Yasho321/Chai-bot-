import mongoose from "mongoose";
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  chapters: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;
