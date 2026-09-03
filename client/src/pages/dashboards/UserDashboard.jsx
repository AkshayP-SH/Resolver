import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getComplaints } from '../../services/api';
import ComplaintDetailModal from '../../components/ComplaintDetailModal';
import NewComplaintForm from '../../components/NewComplaintForm';
import FilterBar from '../../components/FilterBar';

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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
      // BUG FIX: Safely handle array vs object response
      const complaintsArray = Array.isArray(data) ? data : (data.complaints || []);
      setComplaints(complaintsArray);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([]);
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
        return <AllComplaintsView onSelectComplaint={setSelectedComplaint} />;
      case 'my-complaints':
        return <MyComplaintsView complaints={myComplaints} loading={loading} onSelectComplaint={setSelectedComplaint} />;
      case 'new-complaint':
        return <NewComplaintForm onCreated={fetchComplaints} />;
      case 'overview':
        return <DashboardOverview complaints={complaints} user={user} onSelectComplaint={setSelectedComplaint} />;
      default:
        return <AllComplaintsView complaints={complaints} loading={loading} onSelectComplaint={setSelectedComplaint} />;
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

      {/* MODAL RENDERED AT ROOT */}
      {selectedComplaint && (
        <ComplaintDetailModal 
          complaint={selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
          onUpdate={fetchComplaints} 
        />
      )}
    </div>
  );
}

function AllComplaintsView({ onSelectComplaint }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        setLoading(true);
        const data = await getComplaints(filters);
        setComplaints(Array.isArray(data) ? data : (data.complaints || []));
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [filters]);

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">All Complaints</h1>
      <FilterBar onFilterChange={setFilters} />
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : complaints.length === 0 ? (
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

function MyComplaintsView({ complaints, loading, onSelectComplaint }) {
  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-black mb-6">My Complaints</h1>
      <div className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body">
          {complaints.length === 0 ? (
            <p className="text-center py-8 text-base-content/60">You haven't filed any complaints yet.</p>
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
                    <tr key={complaint._id} className="hover:bg-base-200 cursor-pointer" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td>
                        <span className={`badge rounded-none ${
                          complaint.priority === 'URGENT' ? 'badge-error' :
                          complaint.priority === 'HIGH' ? 'badge-warning' :
                          'badge-ghost'
                        }`}>{complaint.priority}</span>
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

function DashboardOverview({ complaints, user, onSelectComplaint }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'SUBMITTED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'REJECTED').length;

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Welcome back, {user.name || 'User'}</h1>
      <p className="text-base-content/60 mb-8">Here's an overview of complaints in the system.</p>

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
                    <tr key={complaint._id} className="hover:bg-base-200 cursor-pointer" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td>
                        <span className={`badge rounded-none ${
                          complaint.priority === 'URGENT' ? 'badge-error' :
                          complaint.priority === 'HIGH' ? 'badge-warning' :
                          'badge-ghost'
                        }`}>{complaint.priority}</span>
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