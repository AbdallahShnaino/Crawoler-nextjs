"use client";
import { submitUser, SubmitUserStatus } from "@/actions/createUserAction";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

const initialState: SubmitUserStatus = {
  success: false,
  message: "",
  error: "",
};

const SignupForm = () => {
  const [formState, action, isPending] = useActionState(
    submitUser,
    initialState
  );
  const router = useRouter();
  useEffect(() => {
    if (formState.success) {
      router.push("/login");
    }
  }, [formState.success, router]);
  return (
    <form action={action}>
      <div className="flex flex-col mt-4 gap-1.5">
        <label htmlFor="email">Username*</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border-1 border-gray-400 rounded-md px-1.5 py-1.5 focus:outline-blue-500"
          required
        />
      </div>
      <div className="flex flex-col mt-4 gap-1.5">
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border-1 border-gray-400 rounded-md px-1.5 py-1.5 focus:outline-blue-500"
          required
        />
      </div>

      {!formState.success && (
        <div className="text-red-600 mt-3 text-center">{formState.message}</div>
      )}
      <input
        type="submit"
        value={isPending ? "Submitting..." : "submit"}
        className="border-2 w-full rounded-md mt-4 p-2.5 text-lg cursor-pointer bg-[#1f2328] text-white hover:bg-[#32383f]"
      />
    </form>
  );
};

export default SignupForm;
