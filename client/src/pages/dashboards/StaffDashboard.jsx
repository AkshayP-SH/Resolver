import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-sm px-8 py-4">
        <div className="flex-1">
          <Link 
            to="/" 
            className="btn btn-ghost text-2xl font-black tracking-tighter rounded-none p-0"
          >
            RESOLVER
          </Link>
        </div>
        <div className="flex-none flex items-center gap-4">
          <div className="badge badge-primary rounded-none badge-sm">STAFF</div>
          <div className="text-sm text-base-content/60">
            {user.name || user.email}
          </div>
          <ThemeToggle />
          <button 
            className="btn btn-ghost btn-sm rounded-none"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight">Staff Queue</h1>
            <p className="text-base-content/60 mt-2">Complaints assigned to you for resolution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Assigned</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Pending</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">In Progress</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Resolved</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Assigned Complaints</h2>
            <div className="flex gap-2">
              <select className="select select-bordered rounded-none select-sm">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Solved</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm rounded-none">
            <div className="card-body">
              <div className="text-center py-12 text-base-content/60">
                <p className="text-lg mb-2">No complaints assigned to you yet.</p>
                <p className="text-sm">Assigned complaints will appear here once they are routed to you.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}