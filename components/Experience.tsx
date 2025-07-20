'use client';
import { useEffect, useState } from 'react';

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
    <section
      id="experience"
      className="py-24 px-[6vw] bg-gradient-to-b relative overflow-hidden"
    >
      {/* Heading */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-extrabold text-white tracking-wide">My Experience</h2>
        <p className="text-cyan-400 mt-3 text-lg font-medium">Where I’ve Worked and Grown</p>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Vertical line center */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500/40 to-blue-500/40 z-0"></div>

        {/* Experience cards */}
        {experiences.map((exp, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div
              key={exp._id}
              className={`relative z-10 mb-20 flex flex-col sm:flex-row ${
                isLeft ? 'sm:justify-start' : 'sm:justify-end'
              }`}
            >
              {/* Line dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-6 h-6 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full border-4 border-gray-900 animate-ping delay-100" />
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-4 h-4 bg-white rounded-full border-2 border-cyan-400 z-10" />

              {/* Card */}
              <div
                className={`relative max-w-xl w-full bg-white/5 backdrop-blur-lg border border-cyan-700/30 rounded-3xl shadow-xl transition-transform transform hover:scale-[1.03] hover:shadow-cyan-500/30 p-6 sm:p-8 ${
                  isLeft ? 'sm:ml-10' : 'sm:mr-10'
                }`}
              >
                {/* Logo */}
                {exp.logo && (
                  <div className="absolute -top-10 sm:-top-12 left-6 sm:left-8 bg-white p-1 rounded-full shadow-md w-16 h-16 flex items-center justify-center">
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-12 h-12 object-contain rounded-full"
                    />
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{exp.role}</h3>
                  <p className="text-cyan-400 text-md font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-400 mt-1">{exp.period}</p>
                  <p className="text-gray-300 text-sm mt-4 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
