import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { showToast } from '../services/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      showToast('Reset link sent if account exists', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 border border-base-300 rounded-none animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Forgot Password?</h1>
          <p className="text-base-content/60 mt-2">Enter your email and we'll send you a reset link.</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/30 rounded-none text-success text-sm">
              Check your inbox. If an account exists for {email}, you will receive a password reset link shortly.
            </div>
            <Link to="/login" className="btn btn-primary w-full rounded-none font-semibold">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text uppercase tracking-widest text-[11px] font-bold text-base-content/70">Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-none focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full rounded-none text-base font-semibold mt-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Link'}
            </button>

            <p className="text-center text-base-content/60 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-primary hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}