import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { email, role: data.role }));

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <nav className="navbar bg-base-100 shadow-sm px-8 py-4">
        <div className="flex-1">
          <Link 
            to="/" 
            className="btn btn-ghost text-2xl font-black tracking-tighter rounded-none p-0"
          >
            RESOLVER
          </Link>
        </div>
        <div className="flex-none">
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="card bg-base-100 w-full max-w-md shadow-lg rounded-none">
          <div className="card-body">
            <h2 className="card-title text-3xl font-black tracking-tight">Sign In</h2>
            <p className="text-base-content/60 mb-6">Enter your credentials to continue</p>

            {error && (
              <div className="alert alert-error rounded-none mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input input-bordered w-full rounded-none"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full rounded-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full rounded-none"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-6 text-base-content/60">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}