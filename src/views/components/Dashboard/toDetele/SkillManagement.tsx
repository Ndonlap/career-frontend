import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Database, PlusCircle, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
import { useAdminDashboard } from '../AdminDashboardLayout';

import AdminService from "../../../../services/admin";
import Swal from "sweetalert2";

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., "Programming", "Soft Skill"
  related_courses: string[]; // IDs of related courses
}

const SkillManagement: React.FC = () => {
  const { fetchDashboardData } = useAdminDashboard(); // To trigger dashboard refresh
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getAllSkills(); // Assuming AdminService has this
      setSkills(response.data);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      setError(err.response?.data?.msg || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = () => {
    setIsEditing(false);
    setCurrentSkill({
      name: '',
      description: '',
      category: '',
      related_courses: [],
    });
    setShowModal(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setIsEditing(true);
    setCurrentSkill({
      ...skill,
      related_courses: skill.related_courses || [],
    });
    setShowModal(true);
  };

  const handleDeleteSkill = async (skillId: string, name: string) => {
    Swal.fire({
      title: `Are you sure you want to delete "${name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.deleteSkill(skillId); // Assuming AdminService has this
          Swal.fire("Deleted!", "Skill has been deleted.", "success");
          fetchSkills(); // Refresh list
          fetchDashboardData(); // Refresh layout badges
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to delete skill.", "error");
        }
      }
    });
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({ ...prev!, [name]: value }));
  };

  const handleSaveSkill = async (e: FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    if (!currentSkill?.name || !currentSkill.description || !currentSkill.category) {
      setModalError("Please fill all required fields.");
      setModalLoading(false);
      return;
    }

    try {
      const payload = {
        ...currentSkill,
        related_courses: Array.isArray(currentSkill.related_courses) ? currentSkill.related_courses : [], // Ensure it's an array
      };

      if (isEditing && currentSkill.id) {
        await AdminService.updateSkill(currentSkill.id, payload); // Assuming AdminService has this
      } else {
        await AdminService.createSkill(payload); // Assuming AdminService has this
      }
      Swal.fire("Success!", "Skill saved successfully.", "success");
      setShowModal(false);
      fetchSkills(); // Refresh list
      fetchDashboardData(); // Refresh layout badges
    } catch (err: any) {
      console.error("Error saving skill:", err);
      setModalError(err.response?.data?.msg || "Failed to save skill.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchSkills} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Skill Management</h2>
          <p className="text-slate-600 mt-1">Add, edit, and manage skills in the system</p>
        </div>
        <button
          onClick={handleAddSkill}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-4 w-4" />
          Add New Skill
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Category</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Description</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Related Courses</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <tr key={skill.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-semibold text-slate-800">{skill.name}</div>
                      </td>
                      <td className="py-4 px-2 text-slate-700 capitalize">{skill.category}</td>
                      <td className="py-4 px-2 text-slate-600">{skill.description.substring(0, 50)}...</td>
                      <td className="py-4 px-2 text-slate-600">
                        {skill.related_courses && skill.related_courses.length > 0 ? skill.related_courses.join(', ') : 'None'}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSkill(skill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">No skills found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {isEditing ? `Edit Skill: ${currentSkill?.name}` : "Add New Skill"}
            </h3>
            {modalError && <p className="text-red-600 mb-4">{modalError}</p>}
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                <input type="text" name="name" value={currentSkill?.name || ''} onChange={handleModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" name="category" value={currentSkill?.category || ''} onChange={handleModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={currentSkill?.description || ''} onChange={handleModalChange} rows={3} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              {/* This assumes related courses are entered as comma-separated IDs, or you'd need a more complex selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Related Courses (comma-separated IDs)</label>
                <input type="text" name="related_courses" value={currentSkill?.related_courses?.join(', ') || ''}
                       onChange={(e) => setCurrentSkill(prev => ({ ...prev!, related_courses: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} disabled={modalLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalLoading ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;