'use client';

import React, { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import type { Skill } from '@/types';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data: Skill[]) => setSkills(data));
  }, []);

  const grouped: Record<string, Skill[]> = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section
      id="skills"
      className="py-20 px-6 sm:px-[10vw] lg:px-[18vw] font-sans  clip-path-custom"
    >
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">SKILLS</h2>
        <div className="w-10 h-1 bg-cyan-500 mx-auto mt-2"></div>
        <p className="text-gray-400 mt-4 text-base sm:text-lg font-medium max-w-3xl mx-auto">
          I'm a passionate and dedicated developer with hands-on experience in front-end technologies like HTML, CSS, JavaScript, and React. I enjoy crafting clean, responsive user interfaces and continuously learning to keep up with modern web development trends.
        </p>
      </div>

      {/* Skills Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([category, skillList]) => (
          <div
            key={category}
            className="bg-gray-900/70 backdrop-blur-lg px-6 py-8 rounded-2xl border border-gray-700 shadow-[0_0_20px_1px_rgba(130,69,236,0.2)] transition-transform hover:scale-[1.02] hover:border-white"
          >
            <h3 className="text-2xl sm:text-3xl font-semibold text-cyan-400 mb-6 text-center">
              {category}
            </h3>

            <Tilt
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              perspective={1000}
              scale={1.05}
              transitionSpeed={1000}
              gyroscope={true}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skillList.map((skill) => (
                  <div
                    key={skill._id}
                    className="flex flex-col items-center justify-center text-center bg-gray-950/40 border border-gray-700 rounded-xl py-3 px-4 hover:border-cyan-400 hover:shadow-md transition duration-300"
                  >
                    {skill.logo && (
                      <img
                        src={skill.logo}
                        alt={`${skill.name} logo`}
                        className="w-8 h-8 sm:w-10 sm:h-10 mb-2 object-contain"
                      />
                    )}
                    <span className="text-sm text-gray-200">{skill.name}</span>
                  </div>
                ))}
              </div>
            </Tilt>
          </div>
        ))}
      </div>
    </section>
  );
}
