// "use client";

import Image from "next/image";

const LogoBox = () => {
  return (
    <div className="relative w-[150px] h-[26px]">
      {/* Light Logo */}
      <Image
        src="/logo-light.svg"
        alt="Site Logo Light"
        fill
        className="block dark:hidden"
        loading="eager"
      />

      {/* Dark Logo */}
      <Image
        src="/logo-dark.svg"
        alt="Site Logo Dark"
        fill
        className="hidden dark:block"
        loading="eager"
      />
    </div>
  );
};

export default LogoBox;
