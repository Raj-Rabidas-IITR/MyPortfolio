'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from "lucide-react"; // Add this at the top
export default function EducationList() {
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(setEducations);
  }, []);

  const deleteEdu = async (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    await fetch(`/api/education/${id}`, { method: "DELETE" });
    setEducations(educations.filter((edu: any) => edu._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Education</h1>
        <Link href="/admin/education/create" className="bg-cyan-600 px-4 py-2 rounded text-white">
          Add Education
        </Link>
      </div>

      <ul className="space-y-4">
        {educations.map((edu: any) => (
          <li
            key={edu._id}
            className="p-4 border border-gray-700 rounded-lg flex items-center justify-between gap-4 bg-gray-800"
          >
            {/* Left: Logo Preview */}
            <div className="flex items-center gap-4">
              {edu.logo && (
                <img
                  src={edu.logo}
                  alt={`${edu.school} logo`}
                  className="w-14 h-14 object-contain border border-gray-500 rounded bg-white"
                />
              )}
              <div>
                <p className="text-white font-semibold text-lg">{edu.school}</p>
                <p className="text-sm text-gray-400">{edu.board}</p>
                <p className="text-sm text-gray-400">Grade: {edu.grade} | Year: {edu.year}</p>
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
