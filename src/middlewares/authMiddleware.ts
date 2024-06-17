import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  token?: string;
  user?: string;
}

export interface DecodedToken extends JwtPayload {
  user_id?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1] ?? "";
  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded.user_id;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Check Authentication" });
  }
};

export default authMiddleware;
