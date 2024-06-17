import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/user";

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const changePasswordController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { oldPassword, newPassword } = req.body;

    const currentUser = await User.findById(user);
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordValid = await currentUser.comparePassword(oldPassword);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Old Password is wrong" });
      return;
    }
    currentUser!.password = newPassword;
    await currentUser!.save();
    res.status(200).json({ message: "Password Changed" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Password is wrong" });
      return;
    }
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    res.status(200).json({ message: "Successfully logged in ", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
