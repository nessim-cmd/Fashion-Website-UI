
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
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

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Mock login function (would be replaced with real auth in production)
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simple validation
    if (!email.includes('@') || password.length < 6) {
      toast.error('Invalid email or password');
      throw new Error("Invalid email or password");
    }

    // Mock users
    if (email === "admin@example.com" && password === "admin123") {
      const adminUser: User = {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      toast.success("Welcome back, Admin!");
      return;
    }

    // Regular user login
    const newUser: User = {
      id: "2",
      name: email.split('@')[0],
      email,
      isAdmin: false,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Login successful!");
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simple validation
    if (!name || !email.includes('@') || password.length < 6) {
      toast.error('Please check your information');
      throw new Error("Invalid user information");
    }

    // Create new user
    const newUser: User = {
      id: Math.floor(Math.random() * 1000 + 10).toString(),
      name,
      email,
      isAdmin: false,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Account created successfully!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
