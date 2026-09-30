import { Logo } from "@/sections/Header/components/Logo";
import { ActionButtons } from "@/sections/Header/components/ActionButtons";

export const Header = () => {
  return (
    <div className="fixed items-center bg-white border-b-neutral-200 box-border caret-transparent flex shrink-0 h-12 justify-between outline-[oklab(0.708_0_0_/_0.5)] w-full z-[999] p-2 border-t-black/10 border-x-black/10 border-b border-solid -top-12 inset-x-0">
      <Logo />
      <ActionButtons />
    </div>
  );
};
