'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/education/${id}`)

      .then((res) => res.json())
      .then(setEdu);
  }, [id]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', 'logo');

   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
  method: 'POST',
  body: formData,
});


    const data = await res.json();
    if (data.url) {
      setEdu((prev) => ({ ...prev, logo: data.url }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/education/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(edu),
});


    if (res.ok) {
      router.push('/admin/education');
    } else {
      alert('Failed to update');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold text-cyan-500 mb-4">Edit Education</h1>
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
