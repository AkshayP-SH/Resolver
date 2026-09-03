import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
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
      setSuccess('Profile updated successfully');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-2">Profile Settings</h1>
      <p className="text-base-content/60 mb-8">Manage your account details and security.</p>

      {error && <div className="alert alert-error rounded-none mb-4">{error}</div>}
      {success && <div className="alert alert-success rounded-none mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm rounded-none">
        <div className="card-body space-y-6">
          
          <div className="form-control">
            <label className="label"><span className="label-text uppercase tracking-wider text-xs font-semibold">Display Name</span></label>
            <input 
              type="text" 
              className="input input-bordered rounded-none w-full" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text uppercase tracking-wider text-xs font-semibold">Email Address</span></label>
            <input 
              type="email" 
              className="input input-bordered rounded-none w-full bg-base-200/30" 
              value={formData.email}
              disabled
            />
            <label className="label"><span className="label-text-alt text-base-content/50">Email cannot be changed.</span></label>
          </div>

          <div className="divider uppercase tracking-wider text-xs font-semibold text-base-content/50">Change Password</div>

          <div className="form-control">
            <label className="label"><span className="label-text uppercase tracking-wider text-xs font-semibold">Current Password</span></label>
            <input 
              type="password" 
              className="input input-bordered rounded-none w-full" 
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="Required only if changing password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text uppercase tracking-wider text-xs font-semibold">New Password</span></label>
              <input 
                type="password" 
                className="input input-bordered rounded-none w-full" 
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Min 6 characters"
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text uppercase tracking-wider text-xs font-semibold">Confirm New Password</span></label>
              <input 
                type="password" 
                className="input input-bordered rounded-none w-full" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="card-actions justify-end pt-4">
            <button type="button" className="btn btn-ghost rounded-none" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary rounded-none" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}