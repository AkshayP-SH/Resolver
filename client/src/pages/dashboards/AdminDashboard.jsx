import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function AdminDashboard() {
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
          <div className="badge badge-error rounded-none badge-sm">ADMIN</div>
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
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight">Admin Overview</h1>
            <p className="text-base-content/60 mt-2">Manage complaints, staff, and system-wide operations.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Total Complaints</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Unassigned</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Total Users</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h3 className="text-base-content/60 text-sm uppercase tracking-wide">Staff Members</h3>
                <p className="text-3xl font-black">0</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Recent Complaints */}
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h2 className="card-title text-lg font-bold">Recent Complaints</h2>
                <div className="text-center py-8 text-base-content/60">
                  <p>No complaints to display.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-sm rounded-none">
              <div className="card-body">
                <h2 className="card-title text-lg font-bold">Quick Actions</h2>
                <div className="space-y-3 mt-4">
                  <button className="btn btn-outline rounded-none w-full justify-start">
                    Manage Users
                  </button>
                  <button className="btn btn-outline rounded-none w-full justify-start">
                    Assign Staff to Complaints
                  </button>
                  <button className="btn btn-outline rounded-none w-full justify-start">
                    View System Reports
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Complaints</h2>
            <button className="btn btn-outline btn-sm rounded-none">
              Export Data
            </button>
          </div>

          <div className="card bg-base-100 shadow-sm rounded-none">
            <div className="card-body">
              <div className="text-center py-12 text-base-content/60">
                <p className="text-lg mb-2">No complaints in the system yet.</p>
                <p className="text-sm">All complaints across the platform will appear here.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}