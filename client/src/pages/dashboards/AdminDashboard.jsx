import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getComplaints, getUsers } from '../../services/api';
import ComplaintDetailModal from '../../components/ComplaintDetailModal';
import NewComplaintForm from '../../components/NewComplaintForm';
import UserDetailModal from '../../components/UserDetailModal';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const menuItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'all-complaints', label: 'All Complaints' },
    { id: 'new-complaint', label: 'New Complaint' },
    { id: 'user-management', label: 'User Management' },
  ];

  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getComplaints();
      setComplaints(Array.isArray(data) ? data : (data.complaints || []));
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([]);
    } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally { setLoadingUsers(false); }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <AdminOverview complaints={complaints} user={user} onSelectComplaint={setSelectedComplaint} />;
      case 'all-complaints': return <AdminAllComplaints complaints={complaints} loading={loading} onSelectComplaint={setSelectedComplaint} />;
      case 'new-complaint': return <NewComplaintForm onCreated={fetchComplaints} />;
      case 'user-management': return <UserManagementView users={users} loading={loadingUsers} onSelectUser={setSelectedUser} />;
      default: return <AdminOverview complaints={complaints} user={user} onSelectComplaint={setSelectedComplaint} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} menuItems={menuItems} currentPage={currentPage} onPageChange={setCurrentPage} />
      <nav className="navbar bg-base-100 shadow-sm px-8 py-4">
        <div className="flex-1 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-square rounded-none">☰</button>
          <span className="text-xl font-bold">Admin Dashboard</span>
          <span className="badge badge-error rounded-none">ADMIN</span>
        </div>
        <div className="flex-none flex items-center gap-4">
          <span className="text-sm text-base-content/60">{user.name || user.email}</span>
          <button className="btn btn-outline btn-sm rounded-none" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</button>
        </div>
      </nav>

      <main className="p-8">
        <div className="max-w-6xl mx-auto">{renderPage()}</div>
      </main>

      {selectedComplaint && <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} onUpdate={fetchComplaints} />}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdate={fetchUsers} />}
    </div>
  );
}

function AdminOverview({ complaints, user, onSelectComplaint }) {
  const total = complaints.length;
  const submitted = complaints.filter(c => c.status === 'SUBMITTED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'REJECTED').length;
  const unassigned = complaints.filter(c => !c.assignedTo).length;

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Admin Overview</h1>
      <p className="text-base-content/60 mb-8">System-wide complaint management.</p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="card bg-base-100 shadow-sm rounded-none"><div className="card-body"><p className="text-sm text-base-content/60">Total</p><p className="text-3xl font-black">{total}</p></div></div>
        <div className="card bg-base-100 shadow-sm rounded-none"><div className="card-body"><p className="text-sm text-base-content/60">Submitted</p><p className="text-3xl font-black">{submitted}</p></div></div>
        <div className="card bg-base-100 shadow-sm rounded-none"><div className="card-body"><p className="text-sm text-base-content/60">In Progress</p><p className="text-3xl font-black">{inProgress}</p></div></div>
        <div className="card bg-base-100 shadow-sm rounded-none"><div className="card-body"><p className="text-sm text-base-content/60">Resolved/Rejected</p><p className="text-3xl font-black">{resolved}</p></div></div>
        <div className="card bg-base-100 shadow-sm rounded-none"><div className="card-body"><p className="text-sm text-base-content/60">Unassigned</p><p className="text-3xl font-black">{unassigned}</p></div></div>
      </div>
      <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? <p className="text-center py-8 text-base-content/60">No complaints yet.</p> : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead><tr><th className="rounded-none">Title</th><th>Status</th><th>Priority</th><th>Filed By</th><th>Assigned To</th><th>Date</th></tr></thead>
                <tbody>
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base-200 cursor-pointer" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td><span className={`badge rounded-none ${complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'}`}>{complaint.priority}</span></td>
                      <td>{complaint.createdBy?.name || 'Unknown'}</td>
                      <td>{complaint.assignedTo?.name || 'Unassigned'}</td>
                      <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminAllComplaints({ complaints, loading, onSelectComplaint }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">All Complaints</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? <p className="text-center py-8 text-base-content/60">No complaints found.</p> : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="rounded-none">Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Filed By</th>
                    <th>Assigned To</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base-200 cursor-pointer" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td>
                        <span className={`badge rounded-none ${
                          complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'
                        }`}>{complaint.priority}</span>
                      </td>
                      <td>{complaint.createdBy?.name || 'Unknown'}</td>
                      <td>{complaint.assignedTo?.name || 'Unassigned'}</td>
                      <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UserManagementView({ users, loading, onSelectUser }) {
  if (loading) return <div className="text-center py-12">Loading users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">User Management</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {users.length === 0 ? <p className="text-center py-8 text-base-content/60">No users found.</p> : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead><tr><th className="rounded-none">Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-base-200 cursor-pointer" onClick={() => onSelectUser(u)}>
                      <td className="font-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge rounded-none ${u.role === 'admin' ? 'badge-error' : u.role === 'staff' ? 'badge-warning' : 'badge-ghost'}`}>{u.role.toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}