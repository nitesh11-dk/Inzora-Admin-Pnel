"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginUser } from "./actions"; // server action
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const res = await loginUser(formData);

      if (res.success) {
        toast.success("✅ Logged in successfully!", { autoClose: 2000 });
        
        // Store user info
        localStorage.setItem('user', JSON.stringify({ email: data.email, loggedIn: true }));
        
        // Check if user is admin and redirect accordingly
        if (res.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(res.message || "❌ Login failed, please try again");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("🚨 Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900 px-4">
      <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
