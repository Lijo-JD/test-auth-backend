import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface UserI extends Document {
  email: string;
  password: string;
  comparePassword: Function;
}

const userSchema: Schema<UserI> = new Schema<UserI>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserI>("save", async function (next: Function) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (
  testPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(testPassword, this.password);
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model<UserI>("User", userSchema);

export default UserModel;
