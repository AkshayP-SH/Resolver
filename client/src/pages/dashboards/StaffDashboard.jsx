import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getComplaints, createComplaint, updateComplaint } from '../../services/api';

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const menuItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'all-complaints', label: 'All Complaints' },
    { id: 'assigned-to-me', label: 'Assigned to Me' },
    { id: 'new-complaint', label: 'New Complaint' },
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getComplaints();
      const complaintsArray = Array.isArray(data) ? data : (data.complaints || []);
      setComplaints(complaintsArray);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const assignedToMe = complaints.filter(
    (c) => c.assignedTo && c.assignedTo._id === user.id
  );

  const handleAssignToMe = async (complaintId) => {
    try {
      await updateComplaint(complaintId, { assignedTo: 'self', status: 'ASSIGNED' });
      fetchComplaints(); // Refresh
    } catch (error) {
      console.error('Failed to assign:', error);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaint(complaintId, { status: newStatus });
      fetchComplaints();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <StaffOverview complaints={complaints} assignedToMe={assignedToMe} user={user} />;
      case 'all-complaints':
        return (
          <AllComplaintsView 
            complaints={complaints} 
            loading={loading} 
            onAssign={handleAssignToMe}
            showAssignButton={true}
          />
        );
      case 'assigned-to-me':
        return (
          <AssignedToMeView 
            complaints={assignedToMe} 
            loading={loading}
            onStatusChange={handleStatusChange}
          />
        );
      case 'new-complaint':
        return <NewComplaintForm onCreated={fetchComplaints} />;
      default:
        return <StaffOverview complaints={complaints} assignedToMe={assignedToMe} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <nav className="navbar bg-base-100 shadow-sm px-8 py-4">
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square rounded-none"
          >
            ☰
          </button>
          <span className="text-xl font-bold">Staff Dashboard</span>
          <span className="badge badge-primary rounded-none">STAFF</span>
        </div>
        <div className="flex-none flex items-center gap-4">
          <span className="text-sm text-base-content/60">{user.name || user.email}</span>
          <button 
            className="btn btn-outline btn-sm rounded-none"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function StaffOverview({ complaints, assignedToMe, user }) {
  const total = complaints.length;
  const myAssigned = assignedToMe.length;
  const inProgress = assignedToMe.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = assignedToMe.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Welcome, {user.name || 'Staff'}</h1>
      <p className="text-base-content/60 mb-8">Here's your workload overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Total in System</p>
            <p className="text-3xl font-black">{total}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Assigned to Me</p>
            <p className="text-3xl font-black">{myAssigned}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">In Progress</p>
            <p className="text-3xl font-black">{inProgress}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Resolved</p>
            <p className="text-3xl font-black">{resolved}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">My Active Complaints</h2>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {assignedToMe.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length === 0 ? (
            <p className="text-center py-8 text-base-content/60">No active complaints assigned to you.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="rounded-none">Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedToMe
                    .filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED')
                    .map((complaint) => (
                      <tr key={complaint._id}>
                        <td className="font-semibold">{complaint.title}</td>
                        <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                        <td>
                          <span className={`badge rounded-none ${
                            complaint.priority === 'URGENT' ? 'badge-error' :
                            complaint.priority === 'HIGH' ? 'badge-warning' :
                            'badge-ghost'
                          }`}>
                            {complaint.priority}
                          </span>
                        </td>
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

function AllComplaintsView({ complaints, loading, onAssign, showAssignButton }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">All Complaints</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">No complaints found.</p>
          ) : (
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
                    {showAssignButton && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td>
                        <span className={`badge rounded-none ${
                          complaint.priority === 'URGENT' ? 'badge-error' :
                          complaint.priority === 'HIGH' ? 'badge-warning' :
                          'badge-ghost'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>{complaint.createdBy?.name || 'Unknown'}</td>
                      <td>{complaint.assignedTo?.name || 'Unassigned'}</td>
                      {showAssignButton && (
                        <td>
                          {!complaint.assignedTo && (
                            <button 
                              className="btn btn-primary btn-xs rounded-none"
                              onClick={() => onAssign(complaint._id)}
                            >
                              Assign to Me
                            </button>
                          )}
                        </td>
                      )}
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

function AssignedToMeView({ complaints, loading, onStatusChange }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">Assigned to Me</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">No complaints assigned to you yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="rounded-none">Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Filed By</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td>
                        <span className={`badge rounded-none ${
                          complaint.priority === 'URGENT' ? 'badge-error' :
                          complaint.priority === 'HIGH' ? 'badge-warning' :
                          'badge-ghost'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>{complaint.createdBy?.name || 'Unknown'}</td>
                      <td>
                        <select
                          className="select select-bordered select-sm rounded-none"
                          value={complaint.status}
                          onChange={(e) => onStatusChange(complaint._id, e.target.value)}
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
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

function NewComplaintForm({ onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      await createComplaint(formData);
      setSuccess(true);
      setFormData({ title: '', description: '', category: '', location: '', priority: 'MEDIUM' });
      onCreated();
    } catch (err) {
      setError(err.message || 'Failed to create complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">File New Complaint</h1>
      {success && <div className="alert alert-success rounded-none mb-4"><span>Complaint filed successfully!</span></div>}
      {error && <div className="alert alert-error rounded-none mb-4"><span>{error}</span></div>}

      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Title</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered rounded-none" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered rounded-none" rows="4" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered rounded-none" required>
                <option value="">Select category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Location (optional)</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input input-bordered rounded-none" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Priority</span></label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="select select-bordered rounded-none">
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary rounded-none" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}