import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
  const [stats, setStats] = useState({ totalResolved: 0, avgTimeHours: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [health, setHealth] = useState({ status: 'checking' });

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/stats`);
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error('stats broke:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchHealth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/health`);
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        setHealth({ status: 'down' });
      }
    };

    fetchStats();
    fetchHealth();
  }, []);

  const isOperational = health.status === 'operational';

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">

      <nav className="border-b border-base-300 px-8 py-4 sticky top-0 z-50 bg-base-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/favicon.svg" alt="Resolver" className="w-8 h-8" />
            <span className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors duration-200">
              RESOLVER
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-px h-6 bg-base-300"></div>
            <Link to="/login" className="btn btn-ghost btn-sm rounded-none text-sm font-medium">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm rounded-none text-sm font-medium">Create Account</Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-8 w-full py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-6 animate-fade-in-up">
                Digital Complaint Portal
              </p>

              <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-none animate-fade-in-up delay-1">
                Track complaints.
                <br />
                Resolve faster.
              </h1>

              <p className="text-lg text-base-content/60 mt-8 max-w-md leading-relaxed animate-fade-in-up delay-2">
                File a complaint in 30 seconds. Get assigned to staff in minutes. Track every step until it's resolved.
              </p>

              <div className="flex gap-4 mt-10 animate-fade-in-up delay-3">
                <Link
                  to="/register"
                  className="btn btn-primary rounded-none px-8 py-3 text-base font-semibold group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Create Account
                  <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  onClick={() => alert('anonymous reporting coming soon')}
                  className="btn btn-outline rounded-none px-8 py-3 text-base font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-base-300/30 hover:bg-base-100 transition-all duration-300"
                >
                  Report Anonymously
                </button>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in-up delay-2">

              <div className="border border-base-300 bg-base-100 p-8 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-base-300/20 transition-all duration-300 cursor-default group">
                <p className="text-5xl lg:text-6xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                  {statsLoading ? <span className="animate-pulse text-base-content/20">--</span> : stats.totalResolved}
                </p>
                <p className="text-sm text-base-content/50 mt-3 uppercase tracking-[0.15em] font-bold">Complaints resolved</p>
              </div>

              {/* stat 2 */}
              <div className="border border-base-300 bg-base-100 p-8 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-base-300/20 transition-all duration-300 cursor-default group">
                <p className="text-5xl lg:text-6xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                  {statsLoading ? <span className="animate-pulse text-base-content/20">--</span> : `${stats.avgTimeHours}h`}
                </p>
                <p className="text-sm text-base-content/50 mt-3 uppercase tracking-[0.15em] font-bold">Avg resolution time</p>
              </div>

              {/* health status */}
              <div className={`border p-6 flex items-center gap-4 transition-all duration-300 ${
                isOperational
                  ? 'border-base-300 bg-base-100 hover:border-success/40'
                  : 'border-error/30 bg-error/5'
              }`}>
                <div className="relative flex h-3 w-3">
                  {isOperational && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOperational ? 'bg-success' : 'bg-error'}`}></span>
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {isOperational ? 'All systems operational' : 'Service degraded'}
                  </p>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    {isOperational ? 'Live complaint tracking active' : 'Backend or database unreachable'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-base-300">
        <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="Resolver" className="w-5 h-5 opacity-40" />
            <span className="text-sm text-base-content/40 font-medium">
              © 2026 Resolver — Built for Shnoor International
            </span>
          </div>
          <div className="flex gap-8 text-sm text-base-content/40 font-medium">
            <a href="#" className="hover:text-base-content transition-colors duration-200">About</a>
            <a href="#" className="hover:text-base-content transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-base-content transition-colors duration-200">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}