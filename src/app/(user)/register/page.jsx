"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { registerUser } from "./actions";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();

  const initialData = { name: "", email: "", password: "" };

  const handleRegister = async (formData) => {
    try {
      const res = await registerUser(formData);

      if (res.success) {
        toast.success("🎉 Registered successfully! Redirecting...", {
          autoClose: 2000,
        });
        router.push("/login"); // navigate to login page
      } else {
        toast.error(res.message || "❌ Registration failed");
      }

      return res;
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("🚨 Something went wrong. Please try again.");
      return { success: false, message: err.message };
    }
  };

  return (
    <UserForm
      initialData={initialData}
      onSubmit={handleRegister}
      buttonText="Register"
    />
  );
}
