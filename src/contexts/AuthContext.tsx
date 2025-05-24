import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { api } from "@/utils/api";
import React from "react";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

// Define context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string ) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        
        // Verify token validity with backend
        api.getCurrentUser()
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const userData = await api.login({ email, password });
      
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
      });
      
      // Store token in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
      }));
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const userData = await api.register({ name, email, password });
      
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
      });
      
      // Store token in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
      }));
      
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
