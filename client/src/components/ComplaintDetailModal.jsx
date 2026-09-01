import { useState, useEffect } from 'react';
import { getComments, createComment, updateComplaint, getUsers } from '../services/api';

const ComplaintDetailModal = ({ complaint, onClose, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details'); 
  const [staffList, setStaffList] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (complaint?._id) {
      fetchComments();
      if (user.role === 'admin') fetchStaff();
    }
  }, [complaint]);

  const fetchComments = async () => {
    try {
      const data = await getComments(complaint._id);
      setComments(Array.isArray(data) ? data : (data.comments || []));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await getUsers('staff'); 
      setStaffList(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const data = await createComment({ complaintId: complaint._id, text: newComment });
      const newCommentObj = data.comment || data;
      setComments([...comments, newCommentObj]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (field, value) => {
    try {
      await updateComplaint(complaint._id, { [field]: value });
      if (onUpdate) onUpdate(); 
      onClose(); 
    } catch (err) {
      setError(`Failed to update ${field}.`);
    }
  };

  const getRoleBadge = (commentUser) => {
    if (!commentUser) return { text: 'User', cls: 'badge-ghost' };
    const userId = typeof commentUser === 'object' ? commentUser._id : commentUser;
    if (userId === complaint.createdBy?._id) return { text: 'Creator', cls: 'badge-primary' };
    if (commentUser.role === 'admin') return { text: 'Admin', cls: 'badge-error' };
    if (commentUser.role === 'staff') return { text: 'Staff', cls: 'badge-warning' };
    return { text: 'User', cls: 'badge-ghost' };
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (!complaint) return null;

  // NEW: Lock the UI if the complaint is resolved or closed
  const isLocked = complaint.status === 'RESOLVED' || complaint.status === 'CLOSED';

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl rounded-none border border-base-300 p-0 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 p-6 bg-base-200/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                <h3 className="font-black text-xl tracking-tight uppercase">{complaint.title}</h3>
                {isLocked && <span className="badge badge-neutral rounded-none badge-sm">LOCKED</span>}
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <span>Filed by {complaint.createdBy?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{formatDate(complaint.created_at)}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-square rounded-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-bordered px-6 bg-base-200/10">
          <a className={`tab rounded-none ${activeTab === 'details' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('details')}>Details</a>
          <a className={`tab rounded-none ${activeTab === 'comments' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('comments')}>
            Comments {comments.length > 0 && <span className="badge badge-sm ml-2 rounded-none">{comments.length}</span>}
          </a>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-grow bg-base-100">
          {error && <div className="alert alert-error rounded-none mb-4 text-sm py-2">{error}</div>}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Category</span>
                  <span className="text-sm font-medium">{complaint.category}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Location</span>
                  <span className="text-sm font-medium">{complaint.location || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Date</span>
                  <span className="text-sm font-medium">{formatDate(complaint.updated_at)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Description</span>
                <p className="text-base leading-relaxed bg-base-200/40 p-4 border border-base-300 rounded-none whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Admin / Staff Action Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-base-300">
                {/* Status */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Status</span>
                  <select 
                    className="select select-bordered select-sm rounded-none w-full" 
                    value={complaint.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    disabled={user.role === 'user' || isLocked}
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Priority</span>
                  <select 
                    className="select select-bordered select-sm rounded-none w-full" 
                    value={complaint.priority}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                    disabled={user.role !== 'admin' || isLocked}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                {/* Assigned To */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Assigned To</span>
                  {user.role === 'admin' ? (
                    <select 
                      className="select select-bordered select-sm rounded-none w-full" 
                      value={complaint.assignedTo?._id || ''}
                      onChange={(e) => handleFieldChange('assignedTo', e.target.value)}
                      disabled={isLocked}
                    >
                      <option value="">Unassigned</option>
                      {staffList.map(staff => (
                        <option key={staff._id} value={staff._id}>{staff.name}</option>
                      ))}
                    </select>
                  ) : user.role === 'staff' && !complaint.assignedTo && !isLocked ? (
                    <button 
                      onClick={() => handleFieldChange('assignedTo', user.id)} 
                      className="btn btn-primary btn-sm rounded-none w-full"
                    >
                      Assign to Me
                    </button>
                  ) : (
                    <div className="flex items-center h-8 text-sm font-medium px-2 border border-base-300 rounded-none bg-base-200/20">
                      {complaint.assignedTo?.name || 'Unassigned'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-base-content/50 border border-dashed border-base-300 rounded-none">
                    No comments yet. Be the first to add one.
                  </div>
                ) : (
                  comments.map((c) => {
                    const badge = getRoleBadge(c.user);
                    return (
                      <div key={c._id} className="border border-base-300 p-4 rounded-none bg-base-200/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{c.user?.name || 'Unknown User'}</span>
                            <span className={`badge badge-sm rounded-none ${badge.cls}`}>{badge.text}</span>
                          </div>
                          <span className="text-xs text-base-content/50">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleAddComment} className="space-y-3 pt-4 border-t border-base-300">
                <textarea
                  className="textarea textarea-bordered w-full rounded-none h-24 text-sm"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-sm rounded-none"
                    disabled={loading || !newComment.trim()}
                  >
                    {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ComplaintDetailModal;