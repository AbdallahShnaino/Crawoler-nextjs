import React from "react";
import Link from "next/link";
import SignupForm from "@/components/SignupForm/SignupForm";

const signUpPage = () => {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 py-8 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Create your free account
        </h1>
        <p className="text-sm text-center mb-6 text-gray-600">
          Explore our system core features for individuals.
        </p>
        <SignupForm />
        <div className="text-right text-sm my-4">
          <span className="mr-1">Already have an account?</span>
          <Link href="/login" className="text-blue-600 underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default signUpPage;
