'use client';

import { useEffect, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react'; // Add this at the top
type Project= {
  
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  github?: string;
  liveDemo?: string;
  tags?: string[];
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  console.log("Projects data:", projects);

  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center text-cyan-400 text-xl">
        Loading Projects...
      </div>
    );
  }

  return (
    <section
      id="work"
      className="py-20 px-[7vw] lg:px-[16vw] font-sans relative "
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">PROJECTS</h2>
        <div className="w-40 h-1 bg-cyan-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          A showcase of my work in web development, design, and beyond.
        </p>
      </div>

      {/* Project Cards Grid */}
      <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border border-white bg-gray-900 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-cyan-400/60 hover:-translate-y-2 transition-transform duration-300"
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 line-clamp-3 text-sm mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#112b3e] text-xs font-semibold text-cyan-400 rounded-full px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

             <div className="flex gap-4 mt-4">
  {project.github && (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[#0d1117] text-white border border-gray-600 rounded-lg hover:bg-gray-900 transition"
    >
      <Github size={18} />
      <span>GitHub</span>
    </a>
  )}
   {project.liveDemo && (
    <a
      href={project.liveDemo}
      target="_blank"
      rel="noopener noreferrer"
       className="flex items-center gap-2 text-sm px-3 py-1.5 bg-[#0d1117] text-white border border-gray-600 rounded-lg hover:bg-gray-900 transition">
      <ExternalLink size={18} />
      <span>Preview</span>
    </a>
  )}
</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
