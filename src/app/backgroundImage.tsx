"use client";

import Image from "next/image";
import backgroundStyles from "../../styles/background.module.scss";
import backgroundImage from "../../public/images/default-bg.svg";
import { useEffect, useRef } from "react";

export default function BackgroundImage() {
  const backgroundImageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function toggleBackgroundImageStickiness() {
      if (backgroundImageRef.current) {
        backgroundImageRef.current.style.top = `${window.scrollY}px`;
      }
    }
    window.addEventListener("scroll", toggleBackgroundImageStickiness);
    return () =>
      window.removeEventListener("scroll", toggleBackgroundImageStickiness);
  }, []);

  return (
    <div ref={backgroundImageRef} className={backgroundStyles.Container}>
      <Image
        className={backgroundStyles.Image}
        src={backgroundImage}
        alt="Background Image"
      />
    </div>
  );
}
