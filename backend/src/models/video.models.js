import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: { type: String, required: true },
  chapter: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
}, { timestamps: true });

const Video = mongoose.model("Video", videoSchema);
export default Video;
