'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react'; // Optional: npm i lucide-react
import { toast } from 'react-toastify';
import type { Project } from '@/types/project';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error('Failed to load projects', err));
  }, []);

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success('Project deleted');
      } else {
        const data = await res.json();
        // keep cast narrow here - other parts of the repo still use plain objects
        toast.error((data as { error?: string })?.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Manage Projects</h1>
        <Link href="/admin/projects/create" className="bg-cyan-600 px-4 py-2 rounded text-white hover:bg-cyan-700">
          + Add Project
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-gray-900 border border-gray-700 rounded-lg shadow-md overflow-hidden">
            {project.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
            )}

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3">{project.description}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(project.tags || []).map((tag: string) => (
                    <span key={tag} className="bg-cyan-700 text-white text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-4">
                <Link href={`/admin/projects/${project._id}/edit`} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <button onClick={() => deleteProject(project._id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm">
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
