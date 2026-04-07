"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function LawyerProfileEdit() {
  const { user } = useUser();
  const lawyerProfile = useQuery(api.users.getLawyerProfile);
  const updateProfile = useMutation(api.users.updateLawyerProfile);

  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    specializations: [] as string[],
    yearsOfExperience: 0,
    availableNow: true,
  });

  const [newSpecialization, setNewSpecialization] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (lawyerProfile) {
      setFormData({
        phone: lawyerProfile.phone || "",
        bio: lawyerProfile.bio || "",
        specializations: lawyerProfile.specializations || [],
        yearsOfExperience: lawyerProfile.yearsOfExperience || 0,
        availableNow: lawyerProfile.availableNow ?? true,
      });
    }
  }, [lawyerProfile]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization],
      }));
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateProfile({
        phone: formData.phone,
        bio: formData.bio,
        specializations: formData.specializations,
        yearsOfExperience: parseInt(formData.yearsOfExperience.toString()),
        availableNow: formData.availableNow,
      });
      setMessage("✓ Profile updated successfully!");
    } catch (error) {
      setMessage("✗ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!lawyerProfile) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/Lawyer/Dashboard"
          className="flex items-center gap-2 text-[#111111] hover:text-[#111111] mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>


        {/* Header */}
        <div className="bg-[#fbfbfb] rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-[#111111] mb-2">
            Edit Your Profile
          </h1>
          <p className="text-gray-500">
            Update your professional information
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#fbfbfb] rounded-lg shadow-md p-8 space-y-6 border border-gray-200"
        >
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-4">
              Basic Information
            </h2>

            {/* Name (Read-only) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lawyerProfile.name}
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <span className="text-xs text-gray-400 self-center shrink-0">
                  (Managed by Clerk)
                </span>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={lawyerProfile.email}
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                 <span className="text-xs text-gray-400 self-center shrink-0">
                  (Managed by Clerk)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                To change your name or email, please use the User Button in the navigation bar.
              </p>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                className="w-full px-4 py-2 border border-nyayak-slate rounded-lg focus:ring-2 focus:ring-nyayak-slate focus:border-transparent text-gray-500"
              />
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-4">
              Professional Details
            </h2>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your expertise and experience..."
                rows={4}
                className="w-full px-4 py-2 border border-nyayak-slate rounded-lg focus:ring-2 focus:ring-nyayak-slate focus:border-transparent text-gray-500"
              />
            </div>

            {/* Years of Experience */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="70"
                className="w-full px-4 py-2 border border-nyayak-slate rounded-lg focus:ring-2 focus:ring-nyayak-slate focus:border-transparent text-gray-500"
              />
            </div>

            {/* Specializations */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#111111] mb-2">
                Specializations
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add a specialization..."
                  className="flex-1 px-4 py-2 border border-nyayak-slate rounded-lg focus:ring-2 focus:ring-nyayak-slate focus:border-transparent text-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSpecialization();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSpecialization}
                  className="px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#111111]"
                >
                  Add
                </button>
              </div>

              {/* Specializations List */}
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-nyayak-mute text-[#111111] px-3 py-1 rounded-full border border-gray-200"
                  >
                    <span>{spec}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="text-[#111111] hover:text-[#111111] font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <input
                  type="checkbox"
                  name="availableNow"
                  checked={formData.availableNow}
                  onChange={handleChange}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-nyayak-slate text-gray-500"
                />
                Currently Available for Consultations
              </label>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                message.includes("✓")
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#111111] text-white py-3 rounded-lg hover:bg-[#111111] disabled:opacity-50 transition-all font-medium"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
