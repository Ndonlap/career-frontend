// src/views/components/StudView/StudentSetting.tsx
import React from 'react';
import { Settings } from 'lucide-react';

const StudentSetting: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center min-h-[500px] flex flex-col justify-center items-center">
        <Settings className="h-20 w-20 text-gray-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Settings</h2>
        <p className="text-slate-600 mb-6">Manage your profile, preferences, and privacy settings.</p>
        <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default StudentSetting;