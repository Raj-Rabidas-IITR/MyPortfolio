'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Education = {
  board: string;
  school: string;
  grade: string;
  year: string;
  logo: string;
};

export default function CreateEducation() {
  const [edu, setEdu] = useState<Education>({
    board: '',
    school: '',
    grade: '',
    year: '',
    logo: ''
  });
  const router = useRouter();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'logo');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setEdu({ ...edu, logo: data.url });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/education', {
      method: 'POST',
      body: JSON.stringify(edu),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) router.push('/admin/education');
    else alert("Failed to create education entry");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold text-cyan-500 mb-4">Add Education</h1>
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
        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">Create</button>
      </form>
    </div>
  );
}
