'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();

  const [project, setProject] = useState({
    title: '',
    description: '',
    github: '',
    liveDemo: '',
    image: '',
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'image');

    try {
      const res = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProject((prev) => ({ ...prev, image: data.url }));
        toast.success('Image uploaded');
      } else {
        toast.error(data?.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload error');
    }
  };

  const handleTagAdd = (e: FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...project, tags };

    try {
      const res = await fetch(`/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Project created');
        router.push('/admin/projects');
      } else {
        const data = await res.json();
        toast.error(data?.error || 'Failed to create project');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-cyan-400 rounded hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-cyan-400">Add New Project</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Project Title"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.title}
          onChange={handleInputChange}
        />

        <textarea
          name="description"
          placeholder="Project Description"
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={5}
          value={project.description}
          onChange={handleInputChange}
        />

        <input
          name="github"
          placeholder="GitHub Link"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.github}
          onChange={handleInputChange}
        />

        <input
          name="liveDemo"
          placeholder="Live Demo URL"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={project.liveDemo}
          onChange={handleInputChange}
        />

        {/* Image upload */}
        <div>
          <label className="text-white block mb-1">Upload Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-white" />
          {project.image && (
            <img
              src={project.image}
              alt="Project Cover"
              className="w-32 h-32 mt-2 object-cover rounded border"
            />
          )}
        </div>

        {/* Tags Input */}
        <div>
          <label className="text-white block mb-1">Project Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter a tag and press Add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white"
            />
            <button
              onClick={handleTagAdd}
              className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-red-200 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">
          Create Project
        </button>
      </form>
    </div>
  );
}
