/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { User } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

// Define the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading initially

  const fetchCurrentUser = useCallback(async (currentToken: string) => {
    if (!currentToken) {
        setIsLoading(false);
        return;
    }
    try {
      // Set token for this specific request as interceptor might not have run yet on initial load
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      const response = await apiClient.get<{ user: User }>('/auth/me');
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Also store user details
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // Clear token and user if fetching fails (e.g., token expired)
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      toast.error("Session expired. Please log in again.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        setToken(storedToken);
        fetchCurrentUser(storedToken);
    } else {
        // Also try to load user from local storage if no token (might be from previous mock setup)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // If it looks like a mock user (no proper ID or structure), clear it
            if (!parsedUser.id || typeof parsedUser.isAdmin === 'undefined') {
                localStorage.removeItem("user");
            } else {
                 // This case shouldn't ideally happen with token auth, but handle defensively
                 // Maybe fetch user data if token is missing but user data exists?
                 // For now, just clear if no token.
                 localStorage.removeItem("user");
            }
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("user");
          }
        }
        setIsLoading(false); // No token, not loading
    }
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', { email, password });
      const { token: newToken, user: loggedInUser } = response.data;
      
      setToken(newToken);
      setUser(loggedInUser);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (error: any) {
      console.error("Login failed:", error);
      const message = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      toast.error(message);
      throw new Error(message); // Re-throw to allow form handling
    } finally {
        setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Backend register endpoint expects name, email, password
      await apiClient.post('/auth/register', { name, email, password });
      toast.success("Account created successfully! Please log in.");
      // Optionally, log the user in automatically after signup
      // await login(email, password);
    } catch (error: any) {
      console.error("Signup failed:", error);
      const message = error.response?.data?.message || error.message || "Signup failed. Please try again.";
      toast.error(message);
      throw new Error(message); // Re-throw to allow form handling
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    toast.success("Logged out successfully");
    // No need to call backend logout as it seems client-side only based on backend code
  };

  const isAuthenticated = !!token && !!user; // Check for both token and user data
  const isAdmin = !!user?.isAdmin;

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdmin,
    isLoading,
  };

  // Render children only when not loading initial auth state
  // or provide a loading indicator if preferred
  // if (isLoading) {
  //   return <div>Loading...</div>; // Or a spinner component
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the configured axios instance for use in other parts of the app
export { apiClient };
