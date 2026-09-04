import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyProfile, updateMyProfile } from '../services/api';
import { showToast } from '../services/toast';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
      } catch (err) {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = { name: formData.name };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      await updateMyProfile(payload);
      showToast('Profile updated', 'success');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      // refresh so the navbar name updates everywhere
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">

      <nav className="border-b border-base-300 px-8 py-4 sticky top-0 z-50 bg-base-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-square rounded-none" title="Go back">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon.svg" alt="Resolver" className="w-7 h-7" />
              <span className="text-xl font-black tracking-tighter">RESOLVER</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-black tracking-tight">Profile Settings</h1>
            <p className="text-base-content/60 mt-2">Manage your account details and security.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* account card */}
            <div className="border border-base-300 bg-base-100 rounded-none p-6 md:p-8 animate-fade-in-up delay-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-6">Account</h2>
              <div className="space-y-5">
                <div className="form-control">
                  <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Display Name</span></label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <input
                      type="text"
                      className="input input-bordered rounded-none w-full pl-10 focus:outline-none focus:border-primary transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Email Address</span></label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input
                      type="email"
                      className="input input-bordered rounded-none w-full pl-10 bg-base-200/40"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <label className="label pt-2"><span className="label-text-alt text-base-content/50">Email cannot be changed.</span></label>
                </div>
              </div>
            </div>

            {/* security card */}
            <div className="border border-base-300 bg-base-100 rounded-none p-6 md:p-8 animate-fade-in-up delay-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Change Password</h2>
              <p className="text-xs text-base-content/50 mb-6">Leave these blank if you don't want to change it.</p>
              <div className="space-y-5">
                <div className="form-control">
                  <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Current Password</span></label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input
                      type="password"
                      className="input input-bordered rounded-none w-full pl-10 focus:outline-none focus:border-primary transition-colors"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">New Password</span></label>
                    <input
                      type="password"
                      className="input input-bordered rounded-none w-full focus:outline-none focus:border-primary transition-colors"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Confirm New Password</span></label>
                    <input
                      type="password"
                      className="input input-bordered rounded-none w-full focus:outline-none focus:border-primary transition-colors"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 animate-fade-in-up delay-3">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost rounded-none px-6">Cancel</button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary rounded-none px-8 font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {saving ? <span className="loading loading-spinner loading-xs"></span> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}