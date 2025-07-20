'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react'; // Optional: npm i lucide-react

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter((p: any) => p._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Manage Projects</h1>
        <Link
          href="/admin/projects/create"
          className="bg-cyan-600 px-4 py-2 rounded text-white hover:bg-cyan-700"
        >
          + Add Project
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div
            key={project._id}
            className="bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden"
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3">{project.description}</p>

              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-cyan-700 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-4">
                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => deleteProject(project._id)}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
