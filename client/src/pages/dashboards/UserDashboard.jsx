import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getComplaints, createComplaint } from '../../services/api';

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const menuItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'all-complaints', label: 'All Complaints' },
    { id: 'my-complaints', label: 'My Complaints' },
    { id: 'new-complaint', label: 'New Complaint' },
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getComplaints();
      setComplaints(data.complaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const myComplaints = complaints.filter(
    (c) => c.createdBy && c.createdBy._id === user.id
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'all-complaints':
        return <AllComplaintsView complaints={complaints} loading={loading} />;
      case 'my-complaints':
        return <MyComplaintsView complaints={myComplaints} loading={loading} />;
      case 'new-complaint':
        return <NewComplaintForm onCreated={fetchComplaints} />;
      case 'overview':
        return <DashboardOverview complaints={complaints} user={user} />;
      default:
        return <AllComplaintsView complaints={complaints} loading={loading} />;

    }
  };
  

  return (
    <div className="min-h-screen bg-base-200">
      
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Top navbar */}
      <nav className="navbar bg-base-100 shadow-sm px-8 py-4">
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square rounded-none"
          >
            ☰
          </button>
          <span className="text-xl font-bold">Dashboard</span>
        </div>
        <div className="flex-none flex items-center gap-4">
          <span className="text-sm text-base-content/60">
            {user.name || user.email}
          </span>
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

function AllComplaintsView({ complaints, loading }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">All Complaints</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
      <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">
              No complaints found.
            </p>
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
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span className="badge badge-outline rounded-none">
                          {complaint.status}
                        </span>
                      </td>
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

function MyComplaintsView({ complaints, loading }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">My Complaints</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">
              You haven't filed any complaints yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="rounded-none">Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span className="badge badge-outline rounded-none">
                          {complaint.status}
                        </span>
                      </td>
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
      onCreated(); // erfresh the complaints list
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
      
      {success && (
        <div className="alert alert-success rounded-none mb-4">
          <span>Complaint filed successfully!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error rounded-none mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered rounded-none"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered rounded-none"
                rows="4"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered rounded-none"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location (optional)</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered rounded-none"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select select-bordered rounded-none"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary rounded-none"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ complaints, user }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'SUBMITTED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">
        Welcome back, {user.name || 'User'}
      </h1>
      <p className="text-base-content/60 mb-8">
        Here's an overview of complaints in the system.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Total</p>
            <p className="text-3xl font-black">{total}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm rounded-none">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Pending</p>
            <p className="text-3xl font-black">{pending}</p>
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

      {/* Recent Complaints */}
      <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">No complaints yet.</p>
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
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>
                        <span className="badge badge-outline rounded-none">{complaint.status}</span>
                      </td>
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