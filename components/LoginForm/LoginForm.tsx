"use client";
import { loginUser, LoginUserStatus } from "@/actions/loginUserAction";
import React, { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState: LoginUserStatus = {
  success: false,
  message: "",
  error: "",
};

const LoginForm = () => {
  const [formState, action, isPending] = useActionState(
    loginUser,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      router.push("/dashboard");
    }
  }, [formState.success, router]);

  return (
    <form
      action={action}
      className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg flex flex-col gap-5 border border-[#AFDDFF]"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-[#222831] font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="border border-[#60B5FF] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60B5FF]"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="text-[#222831] font-medium">
            Password
          </label>
        </div>
        <input
          type="password"
          name="password"
          id="password"
          className="border border-[#60B5FF] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c1def8]"
          required
        />
      </div>

      {formState.error && (
        <p className="text-red-500 text-sm font-medium">{formState.error}</p>
      )}
      <input
        type="submit"
        value={isPending ? "Signing in..." : "Sign in"}
        disabled={isPending}
        className={`text-white py-2.5 px-4 rounded-md font-semibold transition-all duration-200 ${
          isPending
            ? "bg-[#FF9149] opacity-50 cursor-not-allowed"
            : "bg-[#FF9149] hover:bg-[#ff7b24] cursor-pointer"
        }`}
      />
    </form>
  );
};

export default LoginForm;
