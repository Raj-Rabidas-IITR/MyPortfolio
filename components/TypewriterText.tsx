"use client";

import { Typewriter } from "react-simple-typewriter";

export default function TypewriterText() {
  return (
    <Typewriter
      words={["Coder", "Web Developer", "UI/UX Designer"]}
      loop
      cursor
      cursorStyle="_"
      typeSpeed={100}
      deleteSpeed={50}
      delaySpeed={2000}
    />
  );
}
