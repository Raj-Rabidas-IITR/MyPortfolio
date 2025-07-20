'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState({
    title: '',
    description: '',
    github: '',
    liveDemo: '',
    tags: [] as string[],
    image: '',
  });
  console.log(project)
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then((res) => res.json())
        .then((data) => setProject(data));
    }
  }, [id]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'project-image');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setProject((prev) => ({ ...prev, image: data.url }));
    }
  };

  const addTag = () => {
    if (tagInput && !project.tags.includes(tagInput)) {
      setProject((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });

    if (res.ok) {
      router.push('/admin/projects');
    } else {
      alert('Failed to update project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.description}
          onChange={handleChange}
        />

        <input
          name="github"
          placeholder="GitHub Link"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.github}
          onChange={handleChange}
        />

        <input
          name="liveDemo"
          placeholder="Live Demo Link"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.liveDemo}
          onChange={handleChange}
        />

        {/* Cover Image */}
        {project.image && (
          <img
            src={project.image}
            alt="Project Cover"
            className="w-full h-48 object-cover rounded border"
          />
        )}
        <input type="file" accept="image/*" onChange={handleFileUpload} className="text-white" />

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter tag and press Add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-cyan-600 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-cyan-700 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-300 hover:text-red-500 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">
          Update Project
        </button>
      </form>
    </div>
  );
}
