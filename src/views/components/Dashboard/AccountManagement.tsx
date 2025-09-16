import React, { useState, useEffect, ChangeEvent } from "react";
import { Users, Filter, PlusCircle, Eye, Edit, Trash2, TrendingUp, TrendingDown, UserCheck, UserX, Shield, Search, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdminDashboard } from './AdminDashboardLayout';

import AdminService from "../../../services/admin";
import Swal from "sweetalert2";

interface UserAccount {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "student" | "counselor" | "admin";
  status: "active" | "inactive" | "suspended";
  last_login_at?: string;
  join_date: string;
  avatar_initials: string;
}

const AccountManagement: React.FC = () => {
  const navigate = useNavigate();
  const { fetchDashboardData } = useAdminDashboard();
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '', first_name: '', last_name: '', password: '', role: 'student', phone: '', dob: '', school: '', specialization: [] as string[]
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getAllUsers({
        role: filterRole,
        status: filterStatus,
        search: searchQuery
      });
      
      const fetchedUsers: UserAccount[] = response.data.map((user: any) => ({
        _id: user._id || user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: user.status,
        last_login_at: user.last_login_at ? 
          new Date(user.last_login_at).toLocaleDateString() + ' ' + new Date(user.last_login_at).toLocaleTimeString() : 
          'Never',
        join_date: new Date(user.join_date || user.created_at).toLocaleDateString(),
        avatar_initials: (user.first_name?.[0] || '') + (user.last_name?.[0] || ''),
      }));
      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.msg || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (searchParams.get('action') === 'add-user') {
      setShowAddUserModal(true);
    }
  }, [filterRole, filterStatus, searchQuery, searchParams]);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    Swal.fire({
      title: `Are you sure you want to set status to '${newStatus}'?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (newStatus === 'suspended') {
            await AdminService.suspendUser(userId);
          } else if (newStatus === 'active') {
            await AdminService.reactivateUser(userId);
          } else {
            await AdminService.updateUser(userId, { status: newStatus });
          }
          Swal.fire("Updated!", "User status has been changed.", "success");
          fetchUsers();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to update user status.", "error");
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.deleteUser(userId);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to delete user.", "error");
        }
      }
    });
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    Swal.fire({
      title: `Change role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change role!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.changeUserRole(userId, { role: newRole });
          Swal.fire("Updated!", "User role has been changed.", "success");
          fetchUsers();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || "Failed to change user role.", "error");
        }
      }
    });
  };

  const handleBulkAction = async (action: string, selectedUserIds: string[]) => {
    if (selectedUserIds.length === 0) {
      Swal.fire("Info", "Please select at least one user.", "info");
      return;
    }

    const actionText = action === 'delete' ? 'delete' : `${action}`;
    Swal.fire({
      title: `Are you sure you want to ${actionText} ${selectedUserIds.length} user(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText} them!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AdminService.bulkUserAction({
            user_ids: selectedUserIds,
            action: action
          });
          Swal.fire("Success!", `Users ${actionText}d successfully.`, "success");
          fetchUsers();
          fetchDashboardData();
        } catch (err: any) {
          Swal.fire("Error!", err.response?.data?.msg || `Failed to ${actionText} users.`, "error");
        }
      }
    });
  };

  const handleNewUserModalChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setModalLoading(true);
    setModalError(null);
    try {
      const { email, first_name, last_name, password, role, phone, dob, school, specialization } = newUserData;
      if (!email || !first_name || !last_name || !password || !role) {
        setModalError("Missing required fields.");
        return;
      }
      
      const userData: any = { email, first_name, last_name, password, role, phone, dob };
      if (role === 'student') {
        userData.school = school;
      } else if (role === 'counselor') {
        userData.specialization = specialization;
      }

      await AdminService.createUser(userData);
      Swal.fire("Created!", "New user account created successfully.", "success");
      setShowAddUserModal(false);
      setNewUserData({ email: '', first_name: '', last_name: '', password: '', role: 'student', phone: '', dob: '', school: '', specialization: [] });
      fetchUsers();
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error creating user:", err);
      setModalError(err.response?.data?.msg || "Failed to create user.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading user accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-600 mt-1">Manage student, counselor, and admin accounts</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="counselor">Counselors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusCircle className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-5 w-5 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.filter(u => u.role === 'student' && u.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">Active Students</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <UserCheck className="h-5 w-5 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.filter(u => u.role === 'counselor' && u.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">Active Counselors</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.filter(u => u.role === 'admin' && u.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">System Admins</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <UserX className="h-5 w-5 text-red-600" />
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {users.filter(u => u.status === 'inactive' || u.status === 'suspended').length}
          </div>
          <div className="text-sm text-slate-600">Inactive/Suspended Users</div>
        </div>
      </div>

      {/* Bulk Actions Section */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => handleBulkAction('suspend', users.filter(u => u.status !== 'suspended').map(u => u._id))}
          className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm"
        >
          Suspend All
        </button>
        <button 
          onClick={() => handleBulkAction('reactivate', users.filter(u => u.status !== 'active').map(u => u._id))}
          className="px-3 py-2 bg-green-500 text-white rounded-md text-sm"
        >
          Activate All
        </button>
        <button 
          onClick={() => handleBulkAction('delete', users.map(u => u._id))}
          className="px-3 py-2 bg-red-500 text-white rounded-md text-sm"
        >
          Delete All
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Last Login</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Join Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{user.avatar_initials}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{user.first_name} {user.last_name}</div>
                            <div className="text-sm text-slate-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full outline-none border ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            user.role === 'counselor' ? 'bg-green-100 text-green-700 border-green-200' :
                            'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="student">Student</option>
                          <option value="counselor">Counselor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.status}
                          onChange={(e) => handleUpdateStatus(user._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full outline-none border ${
                            user.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                            user.status === 'inactive' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{user.last_login_at}</td>
                      <td className="py-4 px-6 text-slate-600">{user.join_date}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/AdminDashboard/account/${user._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/AdminDashboard/account/edit/${user._id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, `${user.first_name} ${user.last_name}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">No users found with current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Add New User</h3>
            {modalError && <p className="text-red-600 mb-4">{modalError}</p>}
            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="first_name" value={newUserData.first_name} onChange={handleNewUserModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" name="last_name" value={newUserData.last_name} onChange={handleNewUserModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={newUserData.email} onChange={handleNewUserModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" value={newUserData.password} onChange={handleNewUserModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={newUserData.role} onChange={handleNewUserModalChange} required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {newUserData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">School</label>
                  <input type="text" name="school" value={newUserData.school} onChange={handleNewUserModalChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              )}
              {newUserData.role === 'counselor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specializations (comma-separated)</label>
                  <input type="text" name="specialization" value={newUserData.specialization.join(', ')} onChange={(e) => setNewUserData(prev => ({ ...prev, specialization: e.target.value.split(',').map(s => s.trim()) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddUserModal(false)} disabled={modalLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;