'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Education {
  _id: string;
  school: string;
  board: string;
  grade: string;
  year: string;
  logo?: string;
}

export default function EducationList() {
  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/education');
      const data = await res.json();
      setEducations(data);
    };

    fetchData();
  }, []);

  const deleteEdu = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    await fetch(`/api/education/${id}`, { method: 'DELETE' });
    setEducations((prev) => prev.filter((edu) => edu._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Education</h1>
        <Link
          href="/admin/education/create"
          className="bg-cyan-600 px-4 py-2 rounded text-white"
        >
          Add Education
        </Link>
      </div>

      <ul className="space-y-4">
        {educations.map((edu) => (
          <li
            key={edu._id}
            className="p-4 border border-gray-700 rounded-lg flex items-center justify-between gap-4 bg-gray-800"
          >
            {/* Left: Logo and Info */}
            <div className="flex items-center gap-4">
              {edu.logo && (
                <div className="relative w-14 h-14">
                  <Image
                    src={edu.logo}
                    alt={`${edu.school} logo`}
                    layout="fill"
                    className="object-contain rounded border border-gray-500 bg-white"
                  />
                </div>
              )}
              <div>
                <p className="text-white font-semibold text-lg">{edu.school}</p>
                <p className="text-sm text-gray-400">{edu.board}</p>
                <p className="text-sm text-gray-400">
                  Grade: {edu.grade} | Year: {edu.year}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-3">
              <Link
                href={`/admin/education/${edu._id}/edit`}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <button
                onClick={() => deleteEdu(edu._id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
