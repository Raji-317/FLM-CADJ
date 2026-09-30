import { LoginCard } from "@/sections/LoginContainer/components/LoginCard";

interface LoginContainerProps {
  onLogin: (email: string, type: 'teacher' | 'admin') => void;
}

export const LoginContainer = ({ onLogin }: LoginContainerProps) => {
  return (
    <div className="items-center bg-[linear-gradient(to_right_bottom,oklch(0.97_0.014_254.604)_0%,rgb(255,255,255)_50%,oklch(0.984_0.003_247.858)_100%)] box-border caret-transparent flex justify-center min-h-[952px] outline-[oklab(0.708_0_0_/_0.5)] p-4">
      <LoginCard onLogin={onLogin} />
    </div>
  );
};
