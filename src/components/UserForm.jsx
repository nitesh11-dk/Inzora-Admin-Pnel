"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function UserForm({ initialData, onSubmit, buttonText }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submitHandler = (data) => {
    startTransition(async () => {
      const res = await onSubmit(data);
      setMessage(res.message);
      if (res.success) reset(data);
    });
  };

  return (
    <div className="flex justify-center w-full items-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          {buttonText === "Register" ? "Register" : "Edit Profile"}
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { required: buttonText === "Register" })}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
          >
            {isPending ? "Processing..." : buttonText}
          </button>

          {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}

          {buttonText === "Register" && (
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-500 hover:underline">
                Login here
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
