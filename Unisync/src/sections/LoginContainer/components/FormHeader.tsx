export const FormHeader = () => {
  return (
    <div className="items-start box-border caret-transparent gap-x-1.5 grid auto-rows-min grid-rows-[auto_auto] outline-[oklab(0.708_0_0_/_0.5)] gap-y-1.5 pt-6 pb-4 px-6">
      <h4 className="text-2xl box-border caret-transparent leading-8 outline-[oklab(0.708_0_0_/_0.5)] text-center mb-1">
        Sign In
      </h4>
      <p className="text-gray-500 box-border caret-transparent outline-[oklab(0.708_0_0_/_0.5)] text-center">
        Choose your account type and enter your credentials
      </p>
    </div>
  );
};
