import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getComplaints } from '../../services/api';
import ComplaintDetailModal from '../../components/ComplaintDetailModal';
import NewComplaintForm from '../../components/NewComplaintForm';
import FilterBar from '../../components/FilterBar';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  // added sharp svgs to the menu items for the rail
  const menuItems = [
    { 
      id: 'overview', label: 'Overview', 
      icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
    },
    { 
      id: 'all-complaints', label: 'All Complaints', 
      icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v6.75m-19.5 0v4.5A2.25 2.25 0 004.5 20.25h15a2.25 2.25 0 002.25-2.25v-4.5" /></svg>
    },
    { 
      id: 'my-complaints', label: 'My Complaints', 
      icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    },
    { 
      id: 'new-complaint', label: 'New Complaint', 
      icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  // dynamically grabs the page title for the top nav
  const currentPageTitle = menuItems.find(i => i.id === currentPage)?.label || 'Dashboard';

  useEffect(() => { fetchComplaints(); }, []);

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

  const myComplaints = complaints.filter((c) => c.createdBy && c.createdBy._id === user.id);

  const renderPage = () => {
    switch (currentPage) {
      case 'all-complaints': return <AllComplaintsView onSelectComplaint={setSelectedComplaint} />;
      case 'my-complaints': return <MyComplaintsView complaints={myComplaints} loading={loading} onSelectComplaint={setSelectedComplaint} />;
      case 'new-complaint': return <NewComplaintForm onCreated={fetchComplaints} />;
      case 'overview': return <DashboardOverview complaints={complaints} user={user} onSelectComplaint={setSelectedComplaint} />;
      default: return <DashboardOverview complaints={complaints} user={user} onSelectComplaint={setSelectedComplaint} />;
    }
  };

  return (
    // added md:pl-16 to push content away from the persistent rail
    <div className="min-h-screen bg-base-200 md:pl-16 transition-all duration-300">
      
      <Sidebar
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* TOP NAV */}
      <nav className="sticky top-0 z-30 navbar bg-base-200/95 backdrop-blur-sm border-b border-base-300 px-4 md:px-8 py-4">
        <div className="flex-1 flex items-center gap-4">
          {/* hamburger only shows on mobile */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="btn btn-ghost btn-sm btn-square rounded-none md:hidden"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
          
          {/* dynamic page title */}
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-base-content uppercase">
            {currentPageTitle}
          </h1>
        </div>

        <div className="flex-none flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-none flex items-center gap-2 h-auto py-2">
              <span className="text-sm font-medium">{user.name || user.email}</span>
              <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-none w-56 border border-base-300 z-50 mt-2">
              <li className="menu-title px-4 py-2">
                <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-bold">Signed in as</span>
                <span className={`badge badge-sm rounded-none mt-1 ${
                  user.role === 'admin' ? 'badge-error' : 
                  user.role === 'staff' ? 'badge-warning' : 'badge-ghost'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </li>
              <li><Link to="/profile" className="font-medium">Manage Profile</Link></li>
              <div className="divider my-0"></div>
              <li>
                <button className="text-error" onClick={() => { localStorage.clear(); window.location.href = '/'; }}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

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

// --- inner views remain exactly the same so nothing breaks ---

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
      } finally { setLoading(false); }
    };
    fetchFiltered();
  }, [filters]);

  return (
    <div>
      <FilterBar onFilterChange={setFilters} />
      <div className="card bg-base-100 shadow-sm rounded-none border border-base-300">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-12 text-base-content/50 font-semibold">Loading...</div>
          ) : complaints.length === 0 ? (
            <p className="text-center py-12 text-base-content/50 font-semibold">No complaints found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/50 border-b border-base-300">
                  <tr>
                    <th className="rounded-none uppercase text-[11px] tracking-widest text-base-content/60">Title</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Category</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Status</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Priority</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Filed By</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base-200/50 cursor-pointer border-b border-base-300/50 last:border-0 transition-colors" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td><span className={`badge rounded-none ${complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'}`}>{complaint.priority}</span></td>
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
  if (loading) return <div className="text-center py-12 text-base-content/50 font-semibold">Loading...</div>;

  return (
    <div className="card bg-base-100 shadow-sm rounded-none border border-base-300">
      <div className="card-body p-0">
        {complaints.length === 0 ? (
          <p className="text-center py-12 text-base-content/50 font-semibold">You haven't filed any complaints yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 border-b border-base-300">
                <tr>
                  <th className="rounded-none uppercase text-[11px] tracking-widest text-base-content/60">Title</th>
                  <th className="uppercase text-[11px] tracking-widest text-base-content/60">Category</th>
                  <th className="uppercase text-[11px] tracking-widest text-base-content/60">Status</th>
                  <th className="uppercase text-[11px] tracking-widest text-base-content/60">Priority</th>
                  <th className="uppercase text-[11px] tracking-widest text-base-content/60">Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-base-200/50 cursor-pointer border-b border-base-300/50 last:border-0 transition-colors" onClick={() => onSelectComplaint(complaint)}>
                    <td className="font-semibold">{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                    <td><span className={`badge rounded-none ${complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'}`}>{complaint.priority}</span></td>
                    <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 border border-base-300 rounded-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"><div className="card-body"><p className="text-xs uppercase font-bold tracking-widest text-base-content/50">Total</p><p className="text-4xl font-black mt-2">{total}</p></div></div>
        <div className="card bg-base-100 border border-base-300 rounded-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"><div className="card-body"><p className="text-xs uppercase font-bold tracking-widest text-base-content/50">Pending</p><p className="text-4xl font-black mt-2">{pending}</p></div></div>
        <div className="card bg-base-100 border border-base-300 rounded-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"><div className="card-body"><p className="text-xs uppercase font-bold tracking-widest text-base-content/50">In Progress</p><p className="text-4xl font-black mt-2">{inProgress}</p></div></div>
        <div className="card bg-base-100 border border-base-300 rounded-none hover:-translate-y-1 hover:shadow-xl transition-all duration-300"><div className="card-body"><p className="text-xs uppercase font-bold tracking-widest text-base-content/50">Resolved</p><p className="text-4xl font-black mt-2">{resolved}</p></div></div>
      </div>

      <div className="card bg-base-100 border border-base-300 rounded-none">
        <div className="card-body p-0">
          {complaints.length === 0 ? (
            <p className="text-center py-12 text-base-content/50 font-semibold">No complaints yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/50 border-b border-base-300">
                  <tr>
                    <th className="rounded-none uppercase text-[11px] tracking-widest text-base-content/60">Title</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Status</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Priority</th>
                    <th className="uppercase text-[11px] tracking-widest text-base-content/60">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-base-200/50 cursor-pointer border-b border-base-300/50 last:border-0 transition-colors" onClick={() => onSelectComplaint(complaint)}>
                      <td className="font-semibold">{complaint.title}</td>
                      <td><span className="badge badge-outline rounded-none">{complaint.status}</span></td>
                      <td><span className={`badge rounded-none ${complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'}`}>{complaint.priority}</span></td>
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