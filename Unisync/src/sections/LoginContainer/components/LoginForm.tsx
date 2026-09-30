import { FormHeader } from "@/sections/LoginContainer/components/FormHeader";
import { FormContent } from "@/sections/LoginContainer/components/FormContent";

interface LoginFormProps {
  onLogin: (email: string, type: 'teacher' | 'admin') => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  return (
    <div className="bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_20px_25px_-5px,rgba(0,0,0,0.1)_0px_8px_10px_-6px] box-border caret-transparent gap-x-6 flex flex-col outline-[oklab(0.708_0_0_/_0.5)] gap-y-6 mb-6 rounded-[14px]">
      <FormHeader />
      <FormContent onLogin={onLogin} />
    </div>
  );
};
