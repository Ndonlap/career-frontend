// components/ContentManagement.tsx
import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, FileText, BookOpen, Briefcase, Award } from 'lucide-react';
import AdminService from "../../../services/admin";

import { validateContentData, formatContentForDisplay } from '../../../utils/contentHelpers';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'careers' | 'skills'>('courses');
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getContent(activeTab);
      setContent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please select a JSON file');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await AdminService.uploadContentFile(activeTab, file);
      setSuccess('File uploaded successfully');
      loadContent();
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to upload file');
    } finally {
      setLoading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleSyncToDB = async () => {
    setLoading(true);
    setError(null);
    try {
      await AdminService.syncContentToDB(activeTab);
      setSuccess('Content synced to database successfully');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to sync content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await AdminService.downloadContentTemplate(activeTab);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to download template');
    }
  };

  const tabConfig = [
    { id: 'courses' as const, label: 'Courses', icon: BookOpen },
    { id: 'careers' as const, label: 'Careers', icon: Briefcase },
    { id: 'skills' as const, label: 'Skills', icon: Award }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
          <Upload className="w-4 h-4" />
          Upload JSON
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>

        <button
          onClick={handleSyncToDB}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          <RefreshCw className="w-4 h-4" />
          Sync to Database
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Content Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {activeTab.toUpperCase()} Content
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading content...</p>
          </div>
        ) : content && content[activeTab] ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Title/Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {content[activeTab].slice(0, 10).map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.title || item.name}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.category || item.industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {content[activeTab].length > 10 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing 10 of {content[activeTab].length} items
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No content available. Upload a JSON file to get started.</p>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;