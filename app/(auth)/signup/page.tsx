import React from "react";
import Link from "next/link";
import SignupForm from "@/components/SignupForm/SignupForm";

const signUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-[#FFECDB]">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-[#AFDDFF]">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#222831]">
          Create your free account
        </h1>
        <p className="text-sm text-center mb-6 text-gray-600">
          Explore our system core features for individuals.
        </p>
        <SignupForm />
        <div className="text-right text-sm mt-6">
          <span className="mr-1 text-[#222831]">Already have an account?</span>
          <Link
            href="/login"
            className="text-[#FF9149] hover:underline font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
