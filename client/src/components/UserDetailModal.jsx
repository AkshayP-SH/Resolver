import { useState } from 'react';
import { updateUser } from '../services/api';
import { showToast } from '../services/toast';

export default function UserDetailModal({ user, onClose, onUpdate }) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(user._id, { role });
      showToast('User role updated!', 'success');
      if (onUpdate) onUpdate();
      setTimeout(() => onClose(), 800);
    } catch (err) {
      showToast('Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl rounded-none border border-base-300 p-0">
        <div className="flex items-center justify-between border-b border-base-300 p-6 bg-base-200/30">
          <h3 className="font-black text-xl tracking-tight uppercase">User Management</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-square rounded-none">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-base-300 p-4 rounded-none bg-base-200/20">
              <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider block mb-1">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="border border-base-300 p-4 rounded-none bg-base-200/20">
              <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider block mb-1">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Role</span>
            <select
              className="select select-bordered rounded-none w-full max-w-xs bg-base-200/40"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-base-300">
            <button onClick={onClose} className="btn btn-ghost btn-sm rounded-none">Cancel</button>
            <button 
              onClick={handleSave} 
              className="btn btn-primary btn-sm rounded-none hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
              disabled={loading || role === user.role}
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}