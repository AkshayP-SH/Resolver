import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { showToast } from '../services/toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      showToast('Password reset successfully! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-base-100 p-8 border border-base-300 rounded-none animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reset Password</h1>
          <p className="text-base-content/60 mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text uppercase tracking-widest text-[11px] font-bold text-base-content/70">New Password</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="input input-bordered w-full rounded-none focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text uppercase tracking-widest text-[11px] font-bold text-base-content/70">Confirm New Password</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full rounded-none focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full rounded-none text-base font-semibold mt-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Reset Password'}
          </button>

          <p className="text-center text-base-content/60 text-sm">
            <Link to="/login" className="font-bold text-primary hover:underline transition-all">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}