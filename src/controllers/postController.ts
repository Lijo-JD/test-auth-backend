import { Response } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "../middlewares/authMiddleware";
import Post from "../models/post";

export const createPostController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { post } = req.body;
    const obj = {
      post,
      userId: user,
    };
    const postObj = new Post(obj);
    await postObj.save();
    res.status(200).json({ message: "Post Saved" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deletePostController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { deleteId } = req.params;
    const post = await Post.findById(deleteId);
    if (post?.userId.toString() !== user) {
      res.status(500).json({ message: "User can't delete" });
      return;
    }
    await Post.findByIdAndDelete(deleteId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const editPostController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { editId } = req.params;
    const { post } = req.body;
    const editPost = await Post.findById(editId);
    if (editPost?.userId.toString() !== user) {
      res.status(500).json({ message: "User can't update" });
      return;
    }
    await Post.findByIdAndUpdate(editId, { post });
    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getPostsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const userId = new Types.ObjectId(user);
    const result = await Post.find({ userId });
    res.status(200).json({ message: "Fetched posts", result });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
