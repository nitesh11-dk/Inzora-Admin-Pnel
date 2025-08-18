"use client";
import { FiLoader } from "react-icons/fi";

const LoadingState = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-600">
      <FiLoader className="animate-spin text-3xl mb-2" />
      <p className="text-lg">{text}</p>
    </div>
  );
};

export default LoadingState;
