"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

interface DecodedToken {
  sub?: string | number;
}

interface AuthContextType {
  token: string | null;
  username: string;
  id: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [id, setId] = useState<number>(-1);

  useEffect(() => {
    function getCookie(name: string): string | undefined {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }
    }

    const storedToken = getCookie("token") || null;
    const storedUsername = getCookie("username") || "";

    setToken(storedToken);
    setUsername(decodeURIComponent(storedUsername));
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt.decode(token) as DecodedToken | null;
        if (decoded) {
          setId(Number(decoded.sub) || -1);
        }
      } catch {
        setId(-1);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, username, id }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
