// src/views/components/CounselorView/CounselorSetting.tsx
import React, { useState, useEffect } from 'react';
import { Settings, User, Phone, Mail, BookOpen, Clock, Loader2 } from 'lucide-react';
import { useCounselorDashboard } from './CounselorDashboardLayout'; // To access counselorProfile

import AuthService from '../../../services/auth'; // To update profile
import Swal from 'sweetalert2';

const CounselorSetting: React.FC = () => {
  const { counselorProfile, fetchDashboardData } = useCounselorDashboard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact_phone: '',
    contact_email: '',
    bio: '',
    specialization: [] as string[],
    availability: [] as any[], // List of objects {day: string, start: string, end: string}
  });

  useEffect(() => {
    if (counselorProfile) {
      setFormData({
        first_name: counselorProfile.first_name || '',
        last_name: counselorProfile.last_name || '',
        email: counselorProfile.email || '',
        contact_phone: counselorProfile.contact_phone || '',
        contact_email: counselorProfile.contact_email || counselorProfile.email || '',
        bio: counselorProfile.bio || '',
        specialization: counselorProfile.specialization || [],
        availability: counselorProfile.availability || [],
      });
      setLoading(false);
    } else {
        // If profile not in context, try to fetch directly (though layout should have done this)
        const fetchProfileDirectly = async () => {
            try {
                const response = await AuthService.getProfile();
                const profile = response.data;
                setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    email: profile.email || '',
                    contact_phone: profile.contact_phone || '',
                    contact_email: profile.contact_email || profile.email || '',
                    bio: profile.bio || '',
                    specialization: profile.specialization || [],
                    availability: profile.availability || [],
                });
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching profile directly in settings:", err);
                setError(err.response?.data?.msg || "Failed to load profile for settings.");
                setLoading(false);
            }
        };
        fetchProfileDirectly();
    }
  }, [counselorProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, specialization: [...prev.specialization, value] };
      } else {
        return { ...prev, specialization: prev.specialization.filter((s) => s !== value) };
      }
    });
  };

  const handleAvailabilityChange = (index: number, field: 'day' | 'start' | 'end', value: string) => {
    setFormData((prev) => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = { ...newAvailability[index], [field]: value };
      return { ...prev, availability: newAvailability };
    });
  };

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: 'Monday', start: '09:00', end: '17:00' }],
    }));
  };

  const removeAvailabilitySlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading for submission
    setError(null);
    try {
      await AuthService.updateProfile(formData); // Use AuthService to update generic user profile fields
      // For counselor-specific fields, ensure backend endpoint handles them (PUT /api/auth/me or PUT /api/counselor/profile)
      Swal.fire('Updated!', 'Your settings have been saved.', 'success');
      fetchDashboardData(); // Refresh layout context to reflect changes
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setError(err.response?.data?.msg || "Failed to update settings.");
      Swal.fire('Error!', err.response?.data?.msg || 'Failed to update settings.', 'error');
    } finally {
      setLoading(false); // Reset loading
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md">Reload</button>
      </div>
    );
  }


  const availableSpecializations = [
    "Career Planning", "Academic Advising", "Mental Health Support",
    "College Admissions", "Skill Development", "Financial Aid Guidance"
  ];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Settings className="h-8 w-8 text-gray-600" /> Counselor Settings
        </h2>
        <p className="text-slate-600 mb-8">Manage your profile, availability, and communication preferences.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-8 border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 md:col-span-2 flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-indigo-600" /> Personal Information
            </h3>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Login)</label>
              <input type="email" id="email" name="email" value={formData.email} readOnly disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" id="contact_email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" id="contact_phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biography</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
          </div>

          {/* Specialization */}
          <div className="border-b pb-8 border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-green-600" /> Specialization
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableSpecializations.map((spec) => (
                <label key={spec} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specialization.includes(spec)}
                    onChange={handleSpecializationChange}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="border-b pb-8 border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" /> Availability
            </h3>
            <div className="space-y-4">
              {formData.availability.map((slot, index) => (
                <div key={index} className="flex flex-wrap items-center gap-4 p-3 bg-slate-50 rounded-md border border-slate-100">
                  <select
                    value={slot.day}
                    onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                    className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm"
                  >
                    {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => handleAvailabilityChange(index, 'start', e.target.value)}
                    className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => handleAvailabilityChange(index, 'end', e.target.value)}
                    className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAvailabilitySlot}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Availability Slot
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounselorSetting;