"use server";

import bcrypt from "bcryptjs";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";
import Wallet from "@/lib/models/Wallet";

export async function registerUser(formData) {
  const name = formData.name;
  const email = formData.email;
  const password = formData.password;

  await connect();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  await Wallet.create({ userId: user._id, balance: 0 });

  return { success: true, message: "Registered successfully" };
}
