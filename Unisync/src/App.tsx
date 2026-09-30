import { useState } from "react";
import { Header } from "@/sections/Header";
import { LoginContainer } from "@/sections/LoginContainer";
import { Dashboard } from "@/pages/Dashboard";

interface User {
  email: string;
  type: "teacher" | "admin";
}

export const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("unisync_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (email: string, type: "teacher" | "admin") => {
    const newUser: User = { email, type };
    setUser(newUser);
    try {
      localStorage.setItem("unisync_user", JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("unisync_user");
    } catch (e) {
      console.error(e);
    }
  };

  if (user) {
    return (
      <Dashboard
        userType={user.type}
        userEmail={user.email}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="bg-white">
      <Header />

      <div className="fixed overflow-auto inset-0">
        <div className="relative w-full">
          <LoginContainer onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};