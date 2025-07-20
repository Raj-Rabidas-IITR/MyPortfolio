'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditEducation() {
  const { id } = useParams();
  const router = useRouter();
  const [edu, setEdu] = useState({ board: '', school: '', grade: '', year: '', logo: '' });

  useEffect(() => {
    fetch(`/api/education/${id}`).then(res => res.json()).then(setEdu);
  }, [id]);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'logo');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setEdu({ ...edu, logo: data.url });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(edu),
    });
    if (res.ok) router.push('/admin/education');
    else alert("Failed to update");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold text-cyan-500 mb-4">Edit Education</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['board', 'school', 'grade', 'year'].map(field => (
          <input
            key={field}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder={field}
            value={(edu as any)[field]}
            onChange={(e) => setEdu({ ...edu, [field]: e.target.value })}
          />
        ))}
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <button type="submit" className="bg-cyan-500 px-4 py-2 text-white rounded">Update</button>
      </form>
    </div>
  );
}
