import { LogoSection } from "@/sections/LoginContainer/components/LogoSection";

export const LoginHeader = () => {
  return (
    <div className="box-border caret-transparent outline-[oklab(0.708_0_0_/_0.5)] text-center mb-6">
      <LogoSection />
      <h1 className="text-[oklch(0.208_0.042_265.755)] text-3xl font-bold box-border caret-transparent leading-9 outline-[oklab(0.708_0_0_/_0.5)] mb-2">
        EduLeave
      </h1>
      <p className="text-[oklch(0.446_0.043_257.281)] box-border caret-transparent outline-[oklab(0.708_0_0_/_0.5)]">
        Faculty Leave &amp; Class Adjustment System
      </p>
    </div>
  );
};
