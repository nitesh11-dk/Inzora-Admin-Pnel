"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  await connect();
  const user = await User.findOne({ email });
  if (!user) return { success: false, message: "User not found" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { success: false, message: "Invalid credentials" };

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, message: "Login successful", isAdmin: user.isAdmin };
}
