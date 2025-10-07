"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const LogoBox = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoSrc = theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";
  return (
    <>
      {isMounted ? (
        <Image src={logoSrc} alt="Site Logo" width={150} height={26} />
      ) : (
        <div className="text-lg w-[150px] h-[26px]"></div>
      )}
    </>
  );
};

export default LogoBox;
