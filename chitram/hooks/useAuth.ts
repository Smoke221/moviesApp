import { users } from "@/users";
import { useState } from "react";

// Define the User type
interface User {
  username: string;
  password: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // Allow user to be User or null

  const login = (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
}
