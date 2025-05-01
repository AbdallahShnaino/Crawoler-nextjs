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
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-[#222831] font-medium">
          Username*
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border border-[#60B5FF] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#60B5FF] bg-white"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[#222831] font-medium">
          Password*
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border border-[#60B5FF] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#60B5FF] bg-white"
          required
        />
      </div>

      {formState.message && (
        <div className="text-red-600 mt-2 text-center text-sm">
          {formState.message}
        </div>
      )}

      <input
        type="submit"
        value={isPending ? "Submitting..." : "Submit"}
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

export default SignupForm;
