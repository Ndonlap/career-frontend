import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Brain, PlusCircle, Eye, Edit, Trash2, Loader2, BookOpen, BarChart3, Users, Download } from "lucide-react";
import { useAdminDashboard } from './AdminDashboardLayout';
import { useNavigate } from 'react-router-dom';

import AdminService from "../../../services/admin";
import AssessmentService from "../../../services/assessments"; // Import the assessment service
import Swal from "sweetalert2";

interface AssessmentQuestion {
  _id?: string;
  text: string;
  options: string[];
  correct_answer?: string | string[];
  category?: string;
  difficulty?: string;
  points?: number;
  explanation?: string;
}

interface Assessment {
  _id: string;
  id?: string;
  name: string;
  description: string;
  type: "aptitude" | "interest" | "personality" | "quiz";
  duration_minutes: number;
  number_of_questions: number;
  status: "draft" | "published" | "archived";
  questions?: AssessmentQuestion[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

const AssessmentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { fetchDashboardData } = useAdminDashboard();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Partial<Assessment> | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getAllAssessments();
      setAssessments(response.data);
    } catch (err: any) {
      console.error("Error fetching assessments:", err);
      setError(err.response?.data?.msg || "Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentStats = async () => {
    try {
      // This would need to be implemented in your backend
      // For now, we'll calculate basic stats from the assessments
      const stats = {
        total_assessments: assessments.length,
        published: assessments.filter(a => a.status === 'published').length,
        draft: assessments.filter(a => a.status === 'draft').length,
        archived: assessments.filter(a => a.status === 'archived').length,
        total_questions: assessments.reduce((sum, a) => sum + a.number_of_questions, 0)
      };
      setStats(stats);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  useEffect(() => {
    if (assessments.length > 0) {
      fetchAssessmentStats();
    }
  }, [assessments]);

  const handleAddAssessment = () => {
    setIsEditing(false);
    setCurrentAssessment({
      name: '',
      description: '',
      type: 'aptitude',
      duration_minutes: 30,
      number_of_questions: 0,
      status: 'draft',
      questions: [{ text: '', options: ['', ''], correct_answer: '', category: 'General' }],
    });
    setShowModal(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setIsEditing(true);
    setCurrentAssessment({
      ...assessment,
      questions: assessment.questions ? JSON.parse(JSON.stringify(assessment.questions)) : [],
    });
    setShowModal(true);
  };

  const handleViewAssessment = (assessmentId: string) => {
    navigate(`/AdminDashboard/assessments/${assessmentId}`);
  };

  const handleViewAnalytics = (assessmentId: string) => {
    navigate(`/AdminDashboard/assessments/${assessmentId}/analytics`);
  };

  const handleDeleteAssessment = async (assessmentId: string, name: string) => {
    Swal.fire({
      title: `Are you sure you want to delete "${name}"?`,
      text: "This will also delete all associated student results and cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.deleteAssessment(assessmentId);
          Swal.fire("Deleted!", "Assessment has been deleted.", "success");
          fetchAssessments();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to delete assessment.", "error");
        }
      }
    });
  };

  const handleBulkPublish = async (assessmentIds: string[]) => {
    try {
      await AdminService.bulkAssessmentAction(assessmentIds, 'publish');
      Swal.fire("Success!", "Assessments published successfully.", "success");
      fetchAssessments();
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data?.msg || "Failed to publish assessments.", "error");
    }
  };

  const handleExportResults = async (assessmentId: string) => {
    try {
      const response = await AssessmentService.exportAssessmentResults(assessmentId);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assessment_results_${assessmentId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      Swal.fire("Error!", err.response?.data?.msg || "Failed to export results.", "error");
    }
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentAssessment(prev => ({ ...prev!, [name]: value }));
  };

  const handleQuestionChange = (qIndex: number, field: keyof AssessmentQuestion, value: string | string[]) => {
    setCurrentAssessment(prev => {
      const newQuestions = [...(prev!.questions || [])];
      if (field === 'options' && typeof value === 'string') {
        newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value.split(',').map(s => s.trim()) };
      } else {
        newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
      }
      return { ...prev!, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setCurrentAssessment(prev => ({
      ...prev!,
      questions: [...(prev!.questions || []), { text: '', options: ['', ''], correct_answer: '', category: 'General' }],
    }));
  };

  const removeQuestion = (index: number) => {
    setCurrentAssessment(prev => ({
      ...prev!,
      questions: (prev!.questions || []).filter((_, i) => i !== index),
    }));
  };

  const handleSaveAssessment = async (e: FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    if (!currentAssessment?.name || !currentAssessment.description || !currentAssessment.type || !currentAssessment.questions || currentAssessment.questions.length === 0) {
      setModalError("Please fill all assessment details and add at least one question.");
      setModalLoading(false);
      return;
    }

    for (const q of currentAssessment.questions) {
      if (!q.text || !q.options || q.options.length < 2) {
        setModalError("Each question must have text and at least two options.");
        setModalLoading(false);
        return;
      }
      if ((currentAssessment.type === 'aptitude' || currentAssessment.type === 'quiz') && !q.correct_answer) {
        setModalError("Scored assessments require a correct answer for each question.");
        setModalLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...currentAssessment,
        number_of_questions: currentAssessment.questions.length,
      };

      if (isEditing && currentAssessment._id) {
        await AdminService.updateAssessment(currentAssessment._id, payload);
      } else {
        await AdminService.createAssessment(payload);
      }
      Swal.fire("Success!", "Assessment saved successfully.", "success");
      setShowModal(false);
      fetchAssessments();
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error saving assessment:", err);
      setModalError(err.response?.data?.msg || "Failed to save assessment.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading assessments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchAssessments} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Assessments Management</h2>
          <p className="text-slate-600 mt-1">Add, edit, and manage career aptitude and interest assessments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={handleAddAssessment}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Add New Assessment
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && stats && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">Assessment Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total_assessments}</div>
              <div className="text-sm text-blue-800">Total Assessments</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-green-800">Published</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
              <div className="text-sm text-yellow-800">Draft</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.archived}</div>
              <div className="text-sm text-red-800">Archived</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.total_questions}</div>
              <div className="text-sm text-indigo-800">Total Questions</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Questions</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Duration</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.length > 0 ? (
                  assessments.map((assessment) => (
                    <tr key={assessment._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{assessment.name}</div>
                        <p className="text-sm text-slate-600">{assessment.description}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-700 capitalize">{assessment.type}</td>
                      <td className="py-4 px-4 text-slate-700">{assessment.number_of_questions}</td>
                      <td className="py-4 px-4 text-slate-700">{assessment.duration_minutes} min</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          assessment.status === 'published' ? 'bg-green-100 text-green-700' :
                          assessment.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {assessment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewAssessment(assessment._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Assessment"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewAnalytics(assessment._id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExportResults(assessment._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Export Results"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit Assessment"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(assessment._id, assessment.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Assessment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">No assessments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Assessment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {isEditing ? `Edit Assessment: ${currentAssessment?.name}` : "Add New Assessment"}
            </h3>
            {modalError && <p className="text-red-600 mb-4">{modalError}</p>}
            <form onSubmit={handleSaveAssessment} className="space-y-6">
              {/* Assessment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assessment Name</label>
                  <input type="text" name="name" value={currentAssessment?.name || ''} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" value={currentAssessment?.description || ''} onChange={handleModalChange} rows={2} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select name="type" value={currentAssessment?.type || 'aptitude'} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="aptitude">Aptitude</option>
                    <option value="interest">Interest</option>
                    <option value="personality">Personality</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input type="number" name="duration_minutes" value={currentAssessment?.duration_minutes || 0} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={currentAssessment?.status || 'draft'} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t pt-6 mt-6 border-slate-200">
                <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" /> Questions
                </h4>
                {currentAssessment?.questions?.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 border border-slate-100 rounded-lg mb-4 bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-medium text-slate-800">Question {qIndex + 1}</p>
                      <button type="button" onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Question Text</label>
                        <input type="text" value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Options (comma-separated)</label>
                        <input type="text" value={q.options?.join(', ') || ''} onChange={(e) => handleQuestionChange(qIndex, 'options', e.target.value)} required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                      </div>
                      {(currentAssessment.type === 'aptitude' || currentAssessment.type === 'quiz') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                          <input type="text" value={q.correct_answer || ''} onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" value={q.category || ''} onChange={(e) => handleQuestionChange(qIndex, 'category', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Points</label>
                        <input type="number" value={q.points || 1} onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                        <textarea value={q.explanation || ''} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addQuestion}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Add Question
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} disabled={modalLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalLoading ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsManagement;