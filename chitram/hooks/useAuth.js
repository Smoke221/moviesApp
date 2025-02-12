import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { users } from "../app/data/users";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // Store user in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      } else {
        setError("Invalid username or password");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth check error:", err);
    }
  };

  return {
    user,
    login,
    logout,
    error,
    isLoading,
    checkAuthStatus,
  };
}
