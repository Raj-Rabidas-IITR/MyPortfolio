"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProject() {
  const router = useRouter();
  const [form, setForm] = useState<{ title: string; description: string; tags: string; github: string; liveDemo: string; imageUrl: string }>({
    title: '',
    description: '',
    tags: '',
    github: '',
    liveDemo: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tagsArr = form.tags.split(',').map(t => t.trim());
    await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ ...form, tags: tagsArr }),
    });
    router.push('/admin/projects');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-cyan-500">Add New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {( ['title', 'description', 'tags', 'github', 'liveDemo', 'imageUrl'] as const ).map((key) => (
          <input
            key={key}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder={key}
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        <button type="submit" className="bg-cyan-500 px-4 py-2 rounded text-white">Save</button>
      </form>
    </div>
  );
}
