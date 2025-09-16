import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Settings, Server, Lock, Globe, Mail, Clock, Loader2 } from 'lucide-react';
import { useAdminDashboard } from './AdminDashboardLayout';

import AdminService from '../../../services/admin';
import Swal from 'sweetalert2';

interface SystemSettingsData {
  platform_name: string;
  max_users_per_session: number;
  session_timeout_minutes: number;
  two_factor_auth_enabled: boolean;
  password_complexity_level: string;
  data_encryption_standard: string;
  analytics_tracking_enabled: boolean;
  email_notifications_enabled: boolean;
  // Add any other system-wide settings
}

const AdminSetting: React.FC = () => {
  const { adminProfile, fetchDashboardData } = useAdminDashboard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsData, setSettingsData] = useState<SystemSettingsData>({
    platform_name: '',
    max_users_per_session: 0,
    session_timeout_minutes: 0,
    two_factor_auth_enabled: false,
    password_complexity_level: '',
    data_encryption_standard: '',
    analytics_tracking_enabled: false,
    email_notifications_enabled: false,
  });

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getSystemSettings();
      setSettingsData(response.data);
    } catch (err: any) {
      console.error("Error fetching system settings:", err);
      setError(err.response?.data?.msg || "Failed to load system settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []); // Fetch settings on mount

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setSettingsData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading for submission
    setError(null);
    try {
      await AdminService.updateSystemSettings(settingsData);
      Swal.fire('Updated!', 'System settings have been saved.', 'success');
      fetchDashboardData(); // Refresh layout context if needed
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
        <p className="text-lg text-slate-700">Loading system settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchSettings} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Settings className="h-8 w-8 text-gray-600" /> System Configuration
        </h2>
        <p className="text-slate-600 mb-8">Manage global platform settings and security parameters.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-8 border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 md:col-span-2 flex items-center gap-2 mb-4">
                <Server className="h-5 w-5 text-indigo-600" /> General Settings
            </h3>
            <div>
              <label htmlFor="platform_name" className="block text-sm font-medium text-gray-700">Platform Name</label>
              <input type="text" id="platform_name" name="platform_name" value={settingsData.platform_name} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="max_users_per_session" className="block text-sm font-medium text-gray-700">Max Users per Session</label>
              <input type="number" id="max_users_per_session" name="max_users_per_session" value={settingsData.max_users_per_session} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="session_timeout_minutes" className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <input type="number" id="session_timeout_minutes" name="session_timeout_minutes" value={settingsData.session_timeout_minutes} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="email_notifications_enabled" name="email_notifications_enabled" checked={settingsData.email_notifications_enabled} onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600" />
              <label htmlFor="email_notifications_enabled" className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="analytics_tracking_enabled" name="analytics_tracking_enabled" checked={settingsData.analytics_tracking_enabled} onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600" />
              <label htmlFor="analytics_tracking_enabled" className="text-sm font-medium text-gray-700">Enable Analytics Tracking</label>
            </div>
          </div>

          {/* Security Settings */}
          <div className="border-b pb-8 border-slate-100">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-red-600" /> Security Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="two_factor_auth_enabled" name="two_factor_auth_enabled" checked={settingsData.two_factor_auth_enabled} onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600" />
                <label htmlFor="two_factor_auth_enabled" className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              </div>
              <div>
                <label htmlFor="password_complexity_level" className="block text-sm font-medium text-gray-700">Password Complexity</label>
                <select id="password_complexity_level" name="password_complexity_level" value={settingsData.password_complexity_level} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="data_encryption_standard" className="block text-sm font-medium text-gray-700">Data Encryption</label>
                <input type="text" id="data_encryption_standard" name="data_encryption_standard" value={settingsData.data_encryption_standard} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
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

export default AdminSetting;