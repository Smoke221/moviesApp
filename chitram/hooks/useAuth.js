import { users } from "@/users";
import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
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
