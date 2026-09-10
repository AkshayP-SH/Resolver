import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile, updateNotificationPreference, logout, linkGoogleAccount, unlinkGoogleAccount } from '../services/api';
import { showToast } from '../services/toast';
import GoogleButton from '../components/GoogleButton';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [emailNotifs, setEmailNotifs] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
        setName(data.name);
        setEmailNotifs(data.emailNotifications !== false);
      } catch (error) {
        showToast('Failed to load profile', 'error');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateMyProfile({ name });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: updatedUser.name }));
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await updateMyProfile({ currentPassword, newPassword });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), hasPassword: true }));
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEmailNotifs = async (e) => {
    const newValue = e.target.checked;
    setEmailNotifs(newValue);
    try {
      await updateNotificationPreference(newValue);
      showToast(`Email notifications ${newValue ? 'enabled' : 'disabled'}`, 'success');
    } catch (err) {
      setEmailNotifs(!newValue);
      showToast('Failed to update preference', 'error');
    }
  };

  const handleLinkGoogle = async (credential) => {
    setLinking(true);
    try {
      const data = await linkGoogleAccount(credential);
      setUser(data.user);
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, hasGoogle: true }));
      showToast('Google account connected', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to connect Google', 'error');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    setUnlinking(true);
    try {
      const data = await unlinkGoogleAccount();
      setUser(data.user);
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, hasGoogle: false }));
      showToast('Google account disconnected', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to disconnect Google', 'error');
    } finally {
      setUnlinking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2';
  const fieldCls = 'input input-bordered rounded-none w-full bg-base-200/40 border-base-300 focus:outline-none focus:border-primary';

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Manage Profile</h1>
          <p className="text-base-content/60 mt-2">Update your personal details and preferences.</p>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-none">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 border-b border-base-300 pb-2">Personal Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} required />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" value={user.email} disabled className={`${fieldCls} opacity-60 cursor-not-allowed`} />
                <p className="text-xs text-base-content/50 mt-1">Email cannot be changed.</p>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn btn-primary rounded-none font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  {saving ? <span className="loading loading-spinner loading-xs"></span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-none">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 border-b border-base-300 pb-2">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className={labelCls}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={fieldCls} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={fieldCls} required minLength={6} />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fieldCls} required minLength={6} />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn btn-primary rounded-none font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  {saving ? <span className="loading loading-spinner loading-xs"></span> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-none">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 border-b border-base-300 pb-2">Notification Preferences</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-base-content">Email Notifications</p>
                <p className="text-sm text-base-content/60 mt-1">Receive email alerts for status changes and assignments.</p>
              </div>
              <label className="cursor-pointer flex items-center gap-3">
                <span className="text-sm font-medium text-base-content/70">{emailNotifs ? 'On' : 'Off'}</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={emailNotifs} 
                  onChange={handleToggleEmailNotifs} 
                />
              </label>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 rounded-none">
          <div className="card-body p-6 md:p-8">
            <h2 className="text-lg font-bold mb-6 border-b border-base-300 pb-2">Connected Accounts</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-base-content">Google</p>
                <p className="text-sm text-base-content/60 mt-1">
                  {user?.hasGoogle
                    ? `Connected as ${user.email}`
                    : 'Sign in faster with your Google account.'}
                </p>
                {!user?.hasGoogle && (
                  <p className="text-xs text-base-content/50 mt-1 italic">
                    Must match your Resolver email: {user?.email}
                  </p>
                )}
              </div>
              {user?.hasGoogle ? (
                <button
                  onClick={handleUnlinkGoogle}
                  disabled={unlinking || !user?.hasPassword}
                  className="btn btn-error btn-outline btn-sm rounded-none font-semibold"
                  title={!user?.hasPassword ? 'Set a password first to prevent lockout' : 'Disconnect Google'}
                >
                  {unlinking ? <span className="loading loading-spinner loading-xs"></span> : 'Disconnect'}
                </button>
              ) : (
                <div className="min-w-55">
                  <GoogleButton
                    onSuccess={handleLinkGoogle}
                    label="Connect Google"
                    disabled={linking}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={async () => { await logout(); navigate('/'); }} className="btn btn-error btn-outline rounded-none font-semibold">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}