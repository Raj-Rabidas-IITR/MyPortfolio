'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditExperience() {
  const { id } = useParams();
  const router = useRouter();

  const [exp, setExp] = useState<ExperienceType>({
    role: '',
    company: '',
    description: '',
    startDate: '',
    endDate: '',
    logo: '',
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/experience/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setExp({
            role: data.role || '',
            company: data.company || '',
            description: data.description || '',
            startDate: data.startDate?.slice(0, 10) || '',
            endDate: data.endDate?.slice(0, 10) || '',
            logo: data.logo || '',
          });
        });
    }
  }, [id]);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExp((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exp),
    });

    if (res.ok) {
      router.push('/admin/experience');
    } else {
      alert('Failed to update');
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
        <h1 className="text-xl font-bold text-cyan-500">Edit Experience</h1>
      </div>

     {exp.logo && (
  <div className="w-20 h-20 relative mb-4">
    <Image
      src={exp.logo}
      alt="Logo Preview"
      fill
      className="object-contain border rounded bg-white"
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

        <button type="submit" className="bg-cyan-500 px-4 py-2 text-white rounded">
          Update
        </button>
      </form>
    </div>
  );
}
