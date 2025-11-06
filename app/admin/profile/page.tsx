"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from 'react-toastify';

type ProfileType = {
  name: string;
  bio: string;
  profilePic: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
};

type UploadType = "profile" | "resume";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<ProfileType>({
    name: "",
    bio: "",
    profilePic: "",
    resumeUrl: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    fetch(`/api/profile`)
      .then((res) => res.json())
      .then((data: ProfileType) => {
        if (data) setProfile(data);
      });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success('Profile updated');
      } else {
        const data = await res.json();
        toast.error(data?.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: UploadType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", type);

   try {
    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.url) {
      setProfile((prev) => ({
        ...prev,
        [type === "profile" ? "profilePic" : "resumeUrl"]: data.url,
      }));
      toast.success('Uploaded');
    } else {
      toast.error(data?.error || 'Upload failed');
    }
   } catch (err) {
    console.error(err);
    toast.error('Upload error');
   }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-500 mb-4">
        Edit Profile Info
      </h1>

      {/* Profile Picture Upload Preview */}
      {profile.profilePic && (
        <img
          src={profile.profilePic}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover border mb-2"
        />
      )}
      <label className="block text-white font-medium">
        Upload Profile Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, "profile")}
        className="mb-4 text-white"
      />

      {/* Resume Upload & Preview */}
      {profile.resumeUrl && (
        <p className="text-sm text-blue-400 mb-2">
          Current Resume:{" "}
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </p>
      )}
      <label className="block text-white font-medium">
        Upload Resume (PDF)
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFileUpload(e, "resume")}
        className="mb-4 text-white"
      />

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Short Bio"
          rows={4}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="GitHub URL"
          value={profile.github}
          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="LinkedIn URL"
          value={profile.linkedin}
          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
        />
        <button
          type="submit"
          className="bg-cyan-500 px-4 py-2 text-white rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
