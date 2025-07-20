'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from "lucide-react"; // Add this at the top
type Skill = {
  _id: string;
  name: string;
  category: string;
};

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data));
  }, []);

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    setSkills(skills.filter((s) => s._id !== id));
  };

  // Group skills by category
  const grouped = skills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-cyan-500">Manage Skills</h1>
        <Link
          href="/admin/skills/create"
          className="bg-cyan-600 px-4 py-2 rounded text-white hover:bg-cyan-700"
        >
          + Add Skill
        </Link>
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="text-gray-400">No skills found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([category, skills]) => (
          <div
            key={category}
            className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-3">{category}</h2>
            <ul className="space-y-3">
              {skills.map((s) => (
                <li key={s._id} className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded-md hover:bg-gray-700">
                  <span className="text-white">{s.name}</span>

                  <div className="flex gap-2">
                   <Link
    href={`/admin/skills/${s._id}/edit`}
    className="text-cyan-400 hover:text-cyan-300"
    title="Edit"
  >
    <Pencil size={16} />
  </Link>
  <button
    onClick={() => deleteSkill(s._id)}
    className="text-red-400 hover:text-red-300"
    title="Delete"
  >
    <Trash2 size={16} />
  </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
