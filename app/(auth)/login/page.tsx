import LoginForm from "@/components/LoginForm/LoginForm";
import Link from "next/link";
import React from "react";

const loginPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFECDB] p-4">
      <div className="mb-4 text-center">
        <p className="text-3xl font-semibold text-[#222831]">Welcome Back</p>
      </div>
      <LoginForm />
      <div className="text-center border p-5 rounded-xl bg-[#AFDDFF] mt-6 w-full max-w-md shadow-md">
        <p className="text-[#222831] mb-2">New to our system?</p>
        <Link
          href="/signup"
          className="text-[#FF9149] hover:underline font-semibold"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default loginPage;
