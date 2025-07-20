'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from "lucide-react";
import Image from 'next/image';
// ✅ Type for experience
interface Experience {
  _id: string;
  role: string;
  company: string;
  logo?: string;
  startDate: string;
  endDate?: string;
}

export default function ExperienceList() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(setExperiences);
  }, []);

  const deleteExp = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-cyan-500 font-bold">Experience</h1>
        <Link
          href="/admin/experience/create"
          className="bg-cyan-600 px-4 py-2 rounded text-white hover:bg-cyan-700 transition"
        >
          Add
        </Link>
      </div>

      <ul className="space-y-3">
        {experiences.map((exp) => (
          <li
            key={exp._id}
            className="p-4 border border-gray-700 rounded flex justify-between items-center bg-gray-800"
          >
            <div className="flex items-center gap-4">
            {exp.logo && (
  <div className="relative w-12 h-12 rounded border border-gray-500 bg-white overflow-hidden">
    <Image
      src={exp.logo}
      alt={`${exp.company} logo`}
      fill
      className="object-contain"
      sizes="48px"
    />
  </div>
)}

              <div>
                <p className="text-white font-medium">
                  {exp.role} <span className="text-gray-400">@ {exp.company}</span>
                </p>
                <p className="text-sm text-gray-400">
                  {exp.startDate} – {exp.endDate || 'Present'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/admin/experience/${exp._id}/edit`}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <button
                onClick={() => deleteExp(exp._id)}
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
