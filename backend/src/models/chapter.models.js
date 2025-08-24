import mongoose from "mongoose";
const { Schema } = mongoose;

const chapterSchema = new Schema({
  title: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
 
}, { timestamps: true });

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
