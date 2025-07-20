'use client';
import { useEffect, useState } from "react";

type Education = {
  _id: string;
  school: string;
  board: string;
  grade: string;
  year: string;
  logo?: string; // Add logo field
};

export default function Education() {
  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    fetch('/api/education')
      .then(res => res.json())
      .then(data => setEducations(data));
  }, []);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Education</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educations.map((edu) => (
          <div
            key={edu._id}
            className="border border-cyan-700 bg-gray-900 p-4 rounded shadow hover:shadow-cyan-600/30 transition"
          >
            <div className="flex items-center gap-4 mb-3">
              {edu.logo && (
                <img
                  src={edu.logo}
                  alt={`${edu.school} logo`}
                  className="w-12 h-12 object-contain border rounded bg-white p-1"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{edu.school}</h3>
                <p className="text-sm text-gray-400">{edu.board}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300"><strong>Grade:</strong> {edu.grade}</p>
            <p className="text-sm text-gray-400"><strong>Year:</strong> {edu.year}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
