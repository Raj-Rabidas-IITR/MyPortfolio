'use client';
import { useEffect, useState } from 'react';
import type { Project } from "@/types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then((data: Project[]) => setProjects(data));
  }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Projects</h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-gray-900 border border-cyan-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-600/50 transition-shadow"
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{p.description}</p>

              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-cyan-600 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 text-sm mt-2">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {p.liveDemo && (
                  <a
                    href={p.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    Live Demo
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
