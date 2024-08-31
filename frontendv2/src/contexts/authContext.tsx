import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the context and its shape
interface AuthContextType {
  token: string | null;
  setToken: (token: string) => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        credentials: "include", // to send cookies
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
      } else {
        // Handle error, e.g., redirect to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      navigate("/login");
    }
  };

  // Refresh the token whenever the route changes
  useEffect(() => {
    const refreshOnNavigate = () => {
      refreshToken();
    };

    window.addEventListener("popstate", refreshOnNavigate);
    return () => {
      window.removeEventListener("popstate", refreshOnNavigate);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, setToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
