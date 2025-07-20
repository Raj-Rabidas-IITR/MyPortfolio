'use client';
import { useEffect, useState } from "react";

type Experience = {
  _id: string;
  company: string;
  role: string;
  period: string;
  logo?: string;
  description: string;
};

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => setExperiences(data));
  }, []);

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="flex gap-4 items-start border border-cyan-700 bg-gray-900 p-4 rounded hover:shadow-cyan-600/20 transition"
          >
            {exp.logo && (
              <img
                src={exp.logo}
                alt={`${exp.company} logo`}
                className="w-12 h-12 object-contain border rounded bg-white"
              />
            )}
            <div>
              <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
              <p className="text-gray-300">{exp.company}</p>
              <p className="text-sm text-gray-400">{exp.period}</p>
              <p className="mt-2 text-gray-400 text-sm">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
