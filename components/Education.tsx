'use client';
import { useEffect, useState } from 'react';

type Education = {
  _id: string;
  school: string;
  board: string;
  grade: string;
  year: string;
  logo?: string;
};

export default function Education() {
  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    fetch('/api/education')
      .then((res) => res.json())
      .then((data) => setEducations(data));
  }, []);

  return (
    <section
      id="education"
      className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans  clip-path-custom-3"
    >
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">EDUCATION</h2>
        <div className="w-50 h-1 bg-cyan-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          My education has been a journey of learning and development. Here are the details of my academic background
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {educations.map((edu, index) => (
          <div
            key={edu._id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'
            }`}
          >
            {/* Timeline Circle */}
            <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 bg-gray-400 border-4 border-gray-400 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10">
              {edu.logo ? (
                <img
                  src={edu.logo}
                  alt={edu.school}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-xs text-white text-center px-2">No Logo</span>
              )}
            </div>

            {/* Content Card */}
            <div
              className={`w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 hover:shadow-cyan-400/60 backdrop-blur-md
              ${index % 2 === 0 ? 'lg:ml-0' : 'lg:mr-0'} mx-auto transform transition-transform duration-300 hover:scale-105`}
            >
              <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                {/* School Logo */}
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden">
                  {edu.logo ? (
                    <img
                      src={edu.logo}
                      alt={`${edu.school} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-black">
                      No Logo
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{edu.board}</h3>
                  <h4 className="text-sm text-gray-300">{edu.school}</h4>
                  <p className="text-sm text-gray-400 mt-1">Year: {edu.year}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-400 font-bold">Grade: {edu.grade}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
