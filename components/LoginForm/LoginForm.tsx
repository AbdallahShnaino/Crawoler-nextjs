"use client";
import { loginUser, LoginUserStatus } from "@/actions/loginUserAction";
import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const initialState: LoginUserStatus = {
  success: false,
  message: "",
  error: "",
};

const LoginForm = () => {
  const [formState, action] = useActionState(loginUser, initialState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      router.push("/dashboard");
      setLoading(true);
    }
  }, [formState.success, router]);

  return (
    <form
      action={action}
      className="p-5 w-[90%] sm:w-96 flex flex-col gap-5 bg-[#EEEEEE] rounded-lg shadow-lg"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username">Email address</label>
        <input
          type="text"
          name="username"
          id="username"
          className="border-1 border-gray-300 px-1.5 py-1 rounded focus:outline-blue-500 bg-white"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="password">Password</label>
          <Link
            href={"/forget-password"}
            className="text-blue-400 hover:underline"
          >
            Forget password?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          id="password"
          className="border-1 border-gray-300 px-1.5 py-1 rounded focus:outline-blue-500 bg-white"
          required
        />
      </div>

      {formState.error && (
        <p className="text-red-500 text-sm">{formState.error}</p>
      )}
      <input
        disabled={loading}
        type="submit"
        value={loading ? "Loading..." : "Sign in"}
        className="mt-1.5 bg-[#222831] hover:bg-[#393E46] rounded p-2 text-white cursor-pointer"
      />
    </form>
  );
};

export default LoginForm;
