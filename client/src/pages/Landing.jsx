import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';


export default function Landing() {
  const [stats, setStats] = useState({ totalResolved: 0, avgTimeHours: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/public/stats`);
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch public stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <nav className="border-b border-base-300 px-8 py-4 bg-base-100/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors duration-200">
            RESOLVER
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-6 bg-base-300 mx-1"></div>
            <Link to="/login" className="btn btn-ghost btn-sm rounded-none">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm rounded-none">
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 flex items-center max-w-6xl mx-auto px-8 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary animate-fade-in-up">
              Digital Complaint Portal
            </p>

            <h1 className="text-6xl font-black tracking-tight leading-[1.05] mt-4 animate-fade-in-up delay-1">
              Track complaints.
              <br />
              Resolve faster.
            </h1>
            
            <p className="text-lg text-base-content/60 mt-6 max-w-md leading-relaxed animate-fade-in-up delay-2">
              File a complaint in 30 seconds. Get assigned to staff 
              in minutes. Track every step until it's resolved.
            </p>

            <div className="flex gap-4 mt-10 animate-fade-in-up delay-3">
              <Link to="/register" className="btn btn-primary rounded-none px-8 group">
                Create Account
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button 
                onClick={() => alert('Anonymous reporting is coming in the next update!')}
                className="btn btn-outline rounded-none px-8 opacity-70 hover:opacity-100 transition-opacity"
              >
                Report Anonymously
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 lg:pt-8">
            <div className="border border-base-300 bg-base-100 p-6 animate-fade-in-up delay-2 hover:border-primary/50 transition-colors duration-300 cursor-default">
              <p className="text-4xl font-black tracking-tight">
                {statsLoading ? (
                  <span className="animate-pulse text-base-content/30">--</span>
                ) : (
                  stats.totalResolved
                )}
              </p>
              <p className="text-sm text-base-content/50 mt-1 uppercase tracking-wider font-semibold">Complaints resolved</p>
            </div>

            <div className="border border-base-300 bg-base-100 p-6 animate-fade-in-up delay-3 hover:border-primary/50 transition-colors duration-300 cursor-default">
              <p className="text-4xl font-black tracking-tight">
                {statsLoading ? (
                  <span className="animate-pulse text-base-content/30">--</span>
                ) : (
                  `${stats.avgTimeHours}h`
                )}
              </p>
              <p className="text-sm text-base-content/50 mt-1 uppercase tracking-wider font-semibold">Average resolution time</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-base-300 bg-base-100/30">
        <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-base-content/40 font-medium">
            © 2026 Resolver. Built for Shnoor International.
          </span>
          <div className="flex gap-6 text-sm text-base-content/40">
            <a href="#" className="hover:text-base-content transition-colors">About</a>
            <a href="#" className="hover:text-base-content transition-colors">Privacy</a>
            <a href="#" className="hover:text-base-content transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}