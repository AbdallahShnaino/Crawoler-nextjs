"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-gray-800 px-4">
      <div className="animate-pulse mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-[#FF9149]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-6 6h12M5 10h14M5 6h14"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-[#FF9149]">
        Oops! Something went wrong
      </h1>
      <p className="text-center text-gray-700 mb-6 max-w-md">
        We encountered an unexpected error. Please try again or contact support
        if the issue persists.
      </p>

      <button
        onClick={reset}
        className="bg-[#60B5FF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#FF9149] hover:shadow-lg transition-all transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );
}
