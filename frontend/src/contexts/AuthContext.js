import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/supabase";

// Create the authentication context
const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  resetPassword: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await auth.getSession();
        if (error) {
          console.error("Error getting session:", error.message);
        } else {
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, {
        full_name: userData.fullName,
        avatar_url: userData.avatarUrl,
        ...userData,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();

      if (error) throw error;

      setUser(null);
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const { data, error } = await auth.resetPassword(email);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Reset password error:", error.message);
      return { data: null, error };
    }
  };

  // Context value
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    // Helper properties
    isAuthenticated: !!user,
    userEmail: user?.email || null,
    userId: user?.id || null,
    userMetadata: user?.user_metadata || {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
