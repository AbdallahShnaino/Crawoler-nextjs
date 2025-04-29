import LoginForm from "@/components/LoginForm/LoginForm";
import Link from "next/link";
import React from "react";

const loginPage = () => {
  return (
    <div className="h-dvh flex flex-col justify-center items-center gap-5">
      <div>
        <p className="text-2xl mt-3.5">Sign in to our system</p>
      </div>
      <LoginForm />
      <div className="text-center border-1 p-5 rounded-lg w-[90%] sm:w-96">
        <p>New to our system?</p>
        <Link href={"/signup"} className="text-blue-400 hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default loginPage;
