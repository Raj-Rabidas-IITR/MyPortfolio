'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

interface Education {
  board: string;
  school: string;
  grade: string;
  year: string;
  logo: string;
}

export default function EditEducation() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [edu, setEdu] = useState<Education>({
    board: '',
    school: '',
    grade: '',
    year: '',
    logo: '',
  });

  useEffect(() => {
    fetch(`/api/education/${id}`)
      .then((res) => res.json())
      .then(setEdu);
  }, [id]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'logo');

    try {
      const res = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEdu((prev) => ({ ...prev, logo: data.url }));
        toast.success('Logo uploaded');
      } else {
        toast.error(data?.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload error');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu),
      });

      if (res.ok) {
        toast.success('Education updated');
        router.push('/admin/education');
      } else {
        const data = await res.json();
        toast.error(data?.error || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
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
        <h1 className="text-xl font-bold text-cyan-500">Edit Education</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(['board', 'school', 'grade', 'year'] as const).map((field) => (
          <input
            key={field}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder={field}
            value={edu[field]}
            onChange={(e) => setEdu({ ...edu, [field]: e.target.value })}
          />
        ))}
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <button type="submit" className="bg-cyan-500 px-4 py-2 text-white rounded">
          Update
        </button>
      </form>
    </div>
  );
}
