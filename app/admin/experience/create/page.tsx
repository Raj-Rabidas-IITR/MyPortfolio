'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

type ExperienceType = {
  role: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: string;
};

export default function CreateExperience() {
  const router = useRouter();

  const [exp, setExp] = useState<ExperienceType>({
    role: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    logo: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExp((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'logo');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setExp((prev) => ({ ...prev, logo: data.url }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exp),
    });

    if (res.ok) {
      router.push('/admin/experience');
    } else {
      alert('Failed to create experience');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-cyan-400 rounded hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-bold text-cyan-500">Add Experience</h1>
      </div>

{exp.logo && (
  <div className="relative w-20 h-20 mb-4">
    <Image
      src={exp.logo}
      alt="Logo Preview"
      fill
      className="object-contain border rounded bg-white"
      sizes="80px"
    />
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="role"
          placeholder="Role"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={exp.role}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={exp.company}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={exp.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="startDate"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={exp.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={exp.endDate}
          onChange={handleChange}
        />

        <label className="block text-white font-medium">Upload Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="text-white"
        />

        <button type="submit" className="bg-green-600 px-4 py-2 text-white rounded">
          Create
        </button>
      </form>
    </div>
  );
}
