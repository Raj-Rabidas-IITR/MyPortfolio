'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from 'lucide-react';

export default function EditSkillPage() {
  const router = useRouter();
  const { id } = useParams();
  const [skill, setSkill] = useState({
    name: "",
    category: "",
    logo: ""
  });

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/skills/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch skill:", res.statusText);
          return;
        }

        const data = await res.json();
        setSkill(data);
      } catch (err) {
        console.error("Error parsing skill JSON:", err);
      }
    };

    fetchSkill();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });

    if (res.ok) {
      router.push("/admin/skills");
    } else {
      alert("Failed to update skill");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-cyan-400 rounded hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-cyan-400">Edit Skill</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Skill Name"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={skill.name}
          onChange={(e) => setSkill({ ...skill, name: e.target.value })}
          required
        />

        <input
          placeholder="Category"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={skill.category}
          onChange={(e) => setSkill({ ...skill, category: e.target.value })}
          required
        />

        <input
          placeholder="Logo/Icon URL"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={skill.logo}
          onChange={(e) => setSkill({ ...skill, logo: e.target.value })}
        />

        {skill.logo && (
          <img
            src={skill.logo}
            alt="Logo Preview"
            className="w-16 h-16 object-contain border rounded bg-white"
          />
        )}

        <button type="submit" className="bg-green-600 px-4 py-2 rounded text-white">
          Update Skill
        </button>
      </form>
    </div>
  );
}
