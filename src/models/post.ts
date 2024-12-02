import mongoose, { Document, Schema } from "mongoose";

export interface PostI extends Document {
  title: string;
  post: string;
  userId: Schema.Types.ObjectId;
}

const postSchema: Schema<PostI> = new Schema<PostI>(
  {
    title: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostI>("Post", postSchema);

export default PostModel;
