'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from 'lucide-react';

const defaultCategories = ["Frontend", "Backend", "Languages", "Tools"];

export default function CreateSkillPage() {
  const router = useRouter();
  const [customCategory, setCustomCategory] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [skill, setSkill] = useState({ name: "", category: "", logo: "" });

  useEffect(() => {
    setCategories(defaultCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = useCustom ? customCategory : skill.category;
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...skill, category: finalCategory }),
    });

    if (res.ok) router.push("/admin/skills");
    else alert("Failed to create skill");
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
        <h1 className="text-2xl font-bold text-cyan-400">Add New Skill</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Skill Name"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={skill.name}
          onChange={(e) => setSkill({ ...skill, name: e.target.value })}
          required
        />

        <div>
          <label className="text-white block mb-1">Select Category</label>
          <select
            disabled={useCustom}
            className="w-full p-2 rounded bg-gray-800 text-white"
            value={skill.category}
            onChange={(e) => setSkill({ ...skill, category: e.target.value })}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={() => {
                setUseCustom(!useCustom);
                setCustomCategory("");
              }}
            />
            <label className="text-sm text-gray-300">Add custom category</label>
          </div>

          {useCustom && (
            <input
              placeholder="Custom Category"
              className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}
        </div>

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

        <button type="submit" className="bg-cyan-600 px-4 py-2 rounded text-white">
          Create Skill
        </button>
      </form>
    </div>
  );
}
