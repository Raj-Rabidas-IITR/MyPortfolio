'use client';
import React from "react";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Hero from "@/components/Hero";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import BlurBlob from "@/components/BlurBlob";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export default function Home() {
  return (
        <div className="bg-[#050414]">
      {/* Blurred blob */}
      <BlurBlob
        position={{ top: '35%', left: '20%' }}
        size={{ width: '30%', height: '40%' }}
      />

      {/* Grid mask effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Actual Page Content */}
      <div className="relative pt-20">
        <main className="min-h-screen bg-transparent text-white px-4 md:px-12">
          <Navbar/>
          <Hero />
          <Skills />
          <Projects />
          <Education />
          <Experience />
          <Contact />
          <Footer/>
        </main>
      </div>
    </div>
  );
}
