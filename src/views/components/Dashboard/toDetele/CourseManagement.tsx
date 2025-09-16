import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BookOpen, PlusCircle, Edit, Trash2, Loader2, Users, Star, Target } from "lucide-react";
import { useAdminDashboard } from '../AdminDashboardLayout';

import AdminService from "../../../../services/admin";
import Swal from "sweetalert2";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  students_enrolled_count: number;
  average_rating: number;
  status: "active" | "archived";
  prerequisites?: string[];
  skills_gained?: string[];
  related_careers?: string[]; // IDs of related careers
}

const CourseManagement: React.FC = () => {
  const { fetchDashboardData } = useAdminDashboard();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getAllCourses();
      setCourses(response.data);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.msg || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setIsEditing(false);
    setCurrentCourse({
      title: '',
      description: '',
      category: '',
      instructor: '',
      duration: '',
      students_enrolled_count: 0,
      average_rating: 0.0,
      status: 'active',
      prerequisites: [],
      skills_gained: [],
      related_careers: [],
    });
    setShowModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setIsEditing(true);
    setCurrentCourse({
      ...course,
      prerequisites: course.prerequisites || [],
      skills_gained: course.skills_gained || [],
      related_careers: course.related_careers || [],
    });
    setShowModal(true);
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    Swal.fire({
      title: `Are you sure you want to delete "${title}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.deleteCourse(courseId);
          Swal.fire("Deleted!", "Course has been deleted.", "success");
          fetchCourses(); // Refresh list
          fetchDashboardData(); // Refresh layout badges
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to delete course.", "error");
        }
      }
    });
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({ ...prev!, [name]: value }));
  };

  const handleListChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Course) => {
    const { value } = e.target;
    setCurrentCourse(prev => ({ ...prev!, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    if (!currentCourse?.title || !currentCourse.description || !currentCourse.category || !currentCourse.instructor || !currentCourse.duration) {
      setModalError("Please fill all required fields.");
      setModalLoading(false);
      return;
    }

    try {
      const payload = {
        ...currentCourse,
        // Ensure list fields are arrays even if empty
        prerequisites: currentCourse.prerequisites || [],
        skills_gained: currentCourse.skills_gained || [],
        related_careers: currentCourse.related_careers || [],
      };

      if (isEditing && currentCourse.id) {
        await AdminService.updateCourse(currentCourse.id, payload);
      } else {
        await AdminService.createCourse(payload);
      }
      Swal.fire("Success!", "Course saved successfully.", "success");
      setShowModal(false);
      fetchCourses(); // Refresh list
      fetchDashboardData(); // Refresh layout badges
    } catch (err: any) {
      console.error("Error saving course:", err);
      setModalError(err.response?.data?.msg || "Failed to save course.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchCourses} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }


  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Course Management</h2>
          <p className="text-slate-600 mt-1">Add, edit, and manage courses in the system</p>
        </div>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusCircle className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Title</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Category</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Instructor</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Students</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Rating</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-2 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-semibold text-slate-800">{course.title}</div>
                        <p className="text-sm text-slate-600">{course.description.substring(0, 50)}...</p>
                      </td>
                      <td className="py-4 px-2 text-slate-700 capitalize">{course.category}</td>
                      <td className="py-4 px-2 text-slate-700">{course.instructor}</td>
                      <td className="py-4 px-2 text-slate-700">{course.students_enrolled_count}</td>
                      <td className="py-4 px-2 text-slate-700 flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" /> {course.average_rating.toFixed(1)}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">No courses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">
              {isEditing ? `Edit Course: ${currentCourse?.title}` : "Add New Course"}
            </h3>
            {modalError && <p className="text-red-600 mb-4">{modalError}</p>}
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title</label>
                  <input type="text" name="title" value={currentCourse?.title || ''} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <input type="text" name="instructor" value={currentCourse?.instructor || ''} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input type="text" name="category" value={currentCourse?.category || ''} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (e.g., "8 weeks")</label>
                  <input type="text" name="duration" value={currentCourse?.duration || ''} onChange={handleModalChange} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" value={currentCourse?.description || ''} onChange={handleModalChange} rows={3} required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enrollment Count</label>
                  <input type="number" name="students_enrolled_count" value={currentCourse?.students_enrolled_count || 0} onChange={handleModalChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Rating</label>
                  <input type="number" name="average_rating" value={currentCourse?.average_rating || 0.0} onChange={handleModalChange} step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" value={currentCourse?.status || 'active'} onChange={handleModalChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Prerequisites (comma-separated)</label>
                  <textarea name="prerequisites" value={currentCourse?.prerequisites?.join(', ') || ''} onChange={(e) => handleListChange(e, 'prerequisites')} rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Skills Gained (comma-separated)</label>
                  <textarea name="skills_gained" value={currentCourse?.skills_gained?.join(', ') || ''} onChange={(e) => handleListChange(e, 'skills_gained')} rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Related Careers (comma-separated IDs)</label>
                  <textarea name="related_careers" value={currentCourse?.related_careers?.join(', ') || ''} onChange={(e) => handleListChange(e, 'related_careers')} rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} disabled={modalLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalLoading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;