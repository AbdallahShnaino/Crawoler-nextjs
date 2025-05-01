"use client";

import { useAuth } from "@/context/user";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserControls() {
  const { username } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-sm font-medium">
            {username!.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{username}</span>
      </div>

      <button
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Logout"
        title="Logout"
        onClick={handleLogout}
      >
        <Power className="w-5 h-5" />
      </button>
    </div>
  );
}
