import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BlurBlob from "@/components/BlurBlob";

// ✅ Fetch data on the server
async function getProfile() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
    // ✅ Enable caching with ISR (revalidate every 60 seconds)
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export default async function Home() {
  const profile = await getProfile();

  return (
    <div className="bg-[#050414]">
      <BlurBlob
        position={{ top: "35%", left: "20%" }}
        size={{ width: "30%", height: "40%" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative pt-20">
        <main className="min-h-screen bg-transparent text-white px-4 md:px-12">
          <Navbar />
          <Hero profile={profile} /> {/* ✅ Pass pre-fetched data */}
          <Skills />
          <Projects />
          <Education />
          <Experience />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
