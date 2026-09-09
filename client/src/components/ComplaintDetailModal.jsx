import { useState, useEffect } from 'react';
import { getComments, createComment, updateComplaint, deleteComplaint, upvoteComplaint, getUsers } from '../services/api';
import StatusChangeModal from './StatusChangeModal';
import { showToast } from '../services/toast';

const ComplaintDetailModal = ({ complaint, onClose, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false); // For comments
  const [saving, setSaving] = useState(false);   // For edit/save
  const [deleting, setDeleting] = useState(false); // For delete
  const [activeTab, setActiveTab] = useState('details'); 
  const [staffList, setStaffList] = useState([]);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [upvotes, setUpvotes] = useState(complaint?.upvotes || []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (complaint?._id) {
      fetchComments();
      if (user.role === 'admin') fetchStaff();
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setEditData({ title: complaint.title, description: complaint.description });
      setUpvotes(complaint.upvotes || []);
    }
  }, [complaint]);

  const fetchComments = async () => {
    try {
      const data = await getComments(complaint._id);
      setComments(Array.isArray(data) ? data : (data.comments || []));
    } catch (err) { console.error("Failed to fetch comments", err); }
  };

  const fetchStaff = async () => {
    try {
      const data = await getUsers('staff'); 
      setStaffList(Array.isArray(data) ? data : (data.users || []));
    } catch (err) { console.error("Failed to fetch staff", err); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const data = await createComment({ complaintId: complaint._id, text: newComment });
      const newCommentObj = data.comment || data;
      setComments([...comments, newCommentObj]);
      setNewComment('');
      showToast('Comment posted', 'success');
    } catch (err) { 
      showToast('Failed to post comment', 'error'); 
    } finally { setLoading(false); }
  };

  const handleFieldChange = async (field, value) => {
    if (field === 'status' && ['IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(value)) {
      setPendingStatusChange(value);
      return;
    }
    try {
      await updateComplaint(complaint._id, { [field]: value });
      showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`, 'success');
      if (onUpdate) onUpdate(); 
      onClose(); 
    } catch (err) { showToast(`Failed to update ${field}`, 'error'); }
  };

  const confirmStatusChange = async (explanation) => {
    try {
      await updateComplaint(complaint._id, { status: pendingStatusChange, explanation });
      showToast(`Status changed to ${pendingStatusChange}`, 'success');
      if (onUpdate) onUpdate();
      setPendingStatusChange(null);
      onClose();
    } catch (err) {
      showToast('Failed to update status', 'error');
      setPendingStatusChange(null);
    }
  };

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const data = await upvoteComplaint(complaint._id);
      const updated = data.complaint || data;
      setUpvotes(updated.upvotes || []);
      if (onUpdate) onUpdate();
      const nowUpvoted = (updated.upvotes || []).some(id => (typeof id === 'object' ? id._id : id) === user.id);
      showToast(nowUpvoted ? 'Upvoted' : 'Upvote removed', 'success');
    } catch (err) {
      showToast('Failed to upvote', 'error');
    } finally {
      setUpvoting(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateComplaint(complaint._id, editData);
      setIsEditing(false);
      showToast('Complaint updated', 'success');
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) { 
      showToast('Failed to save edits', 'error'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteComplaint(complaint._id);
      showToast('Complaint deleted', 'success');
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) { 
      showToast('Failed to delete complaint', 'error'); 
    } finally { 
      setDeleting(false); 
    }
  };

  const handleViewAttachment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/${complaint._id}/attachment`, {
        credentials: 'include' 
      });
      if (!response.ok) throw new Error('Not authorized');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Attachment fetch error:', err);
      showToast('Failed to load attachment. Session may have expired.', 'error');
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

  const isLocked = complaint.status === 'RESOLVED' || complaint.status === 'REJECTED';
  const isCreator = complaint.createdBy?._id === user.id;
  const isSubmitted = complaint.status === 'SUBMITTED';
  const isAdmin = user.role === 'admin';
  const hasUpvoted = upvotes.some(id => {
    const voteId = typeof id === 'object' ? id._id : id;
    return voteId === user.id;
  });

  return (
    <>
      <dialog className="modal modal-open">
        <div className="modal-box w-11/12 max-w-4xl rounded-none border border-base-300 p-0 flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between border-b border-base-300 p-6 bg-base-200/30 gap-4">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input 
                    type="text" 
                    className="input input-bordered input-sm rounded-none font-black text-lg tracking-tight uppercase w-full" 
                    value={editData.title} 
                    onChange={(e) => setEditData({...editData, title: e.target.value})} 
                    disabled={saving}
                  />
                ) : (
                  <h3 className="font-black text-xl tracking-tight uppercase truncate">{complaint.title}</h3>
                )}
                {isLocked && <span className="badge badge-neutral rounded-none badge-sm shrink-0">LOCKED</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span>Filed by {complaint.createdBy?.name || 'Unknown'}</span>
                <span>•</span>
                <span>{formatDate(complaint.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleUpvote} 
                disabled={upvoting || isEditing || saving || deleting}
                className={`btn btn-sm rounded-none gap-1.5 font-bold uppercase tracking-wider text-xs ${hasUpvoted ? 'btn-primary' : 'btn-ghost border-base-300'}`}
                title="Me Too"
              >
                {upvoting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    {upvotes.length}
                  </>
                )}
              </button>
              <button onClick={onClose} className="btn btn-sm btn-ghost btn-square rounded-none" disabled={saving || deleting}>✕</button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-base-300 bg-base-200/20">
            <button 
              onClick={() => setActiveTab('details')} 
              className={`px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'details' ? 'text-primary' : 'text-base-content/60 hover:text-base-content'}`}
              disabled={saving || deleting}
            >
              Details
              {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('comments')} 
              className={`px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'comments' ? 'text-primary' : 'text-base-content/60 hover:text-base-content'}`}
              disabled={saving || deleting}
            >
              Comments
              {comments.length > 0 && <span className={`badge badge-sm rounded-none ${activeTab === 'comments' ? 'badge-primary' : 'badge-ghost'}`}>{comments.length}</span>}
              {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          <div className="p-6 overflow-y-auto grow bg-base-100">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1"><span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Category</span><span className="text-sm font-medium">{complaint.category}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Location</span><span className="text-sm font-medium">{complaint.location || 'N/A'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Priority</span><span className={`badge rounded-none w-fit ${complaint.priority === 'URGENT' ? 'badge-error' : complaint.priority === 'HIGH' ? 'badge-warning' : 'badge-ghost'}`}>{complaint.priority}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Last Updated</span><span className="text-sm font-medium">{formatDate(complaint.updated_at)}</span></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Description</span>
                  {isEditing ? (
                    <textarea 
                      className="textarea textarea-bordered rounded-none h-32 bg-base-200/40" 
                      value={editData.description} 
                      onChange={(e) => setEditData({...editData, description: e.target.value})} 
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-base leading-relaxed bg-base-200/40 p-4 border border-base-300 rounded-none whitespace-pre-wrap">{complaint.description}</p>
                  )}
                </div>

                {complaint.attachment && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Attachment</span>
                    <div className="flex items-center gap-3 p-3 border border-base-300 rounded-none bg-base-200/40">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{complaint.attachment.filename}</p>
                        <p className="text-xs text-base-content/50">{(complaint.attachment.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={handleViewAttachment} className="btn btn-sm btn-primary rounded-none shrink-0" disabled={saving || deleting}>
                        View
                      </button>
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-base-300">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Status</span>
                      <select className="select select-bordered select-sm rounded-none w-full" value={complaint.status} onChange={(e) => handleFieldChange('status', e.target.value)} disabled={user.role === 'user' || isLocked || saving || deleting}>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Priority</span>
                      <select className="select select-bordered select-sm rounded-none w-full" value={complaint.priority} onChange={(e) => handleFieldChange('priority', e.target.value)} disabled={user.role !== 'admin' || isLocked || saving || deleting}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase font-bold text-base-content/50 tracking-wider">Assigned To</span>
                      {user.role === 'admin' ? (
                        <select className="select select-bordered select-sm rounded-none w-full" value={complaint.assignedTo?._id || ''} onChange={(e) => handleFieldChange('assignedTo', e.target.value)} disabled={isLocked || saving || deleting}>
                          <option value="">Unassigned</option>
                          {staffList.map(staff => <option key={staff._id} value={staff._id}>{staff.name}</option>)}
                        </select>
                      ) : user.role === 'staff' && !complaint.assignedTo && !isLocked ? (
                        <button onClick={() => handleFieldChange('assignedTo', user.id)} className="btn btn-primary btn-sm rounded-none w-full" disabled={saving || deleting}>Assign to Me</button>
                      ) : (
                        <div className="flex items-center h-8 text-sm font-medium px-2 border border-base-300 rounded-none bg-base-200/20">{complaint.assignedTo?.name || 'Unassigned'}</div>
                      )}
                    </div>
                  </div>
                )}

                {complaint.statusHistory && complaint.statusHistory.length > 0 && !isEditing && (
                  <div className="pt-6 border-t border-base-300">
                    <h4 className="text-xs uppercase font-bold text-base-content/50 tracking-wider mb-4">Status History</h4>
                    <div className="border-l-2 border-base-300 pl-4 space-y-6">
                      {complaint.statusHistory.map((h, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary border-2 border-base-100"></div>
                          <div className="text-xs text-base-content/50 mb-1">{formatDate(h.timestamp)}</div>
                          <div className="font-bold text-sm">{h.status}</div>
                          {h.explanation && (
                            <p className="text-sm text-base-content/80 mt-1 bg-base-200/30 p-2 border border-base-300 rounded-none">
                              {h.explanation}
                            </p>
                          )}
                          <p className="text-xs text-base-content/50 mt-2 italic">— {h.changedBy?.name || 'System'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-base-300">
                  {isCreator && isSubmitted && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline rounded-none" disabled={saving || deleting}>Edit Complaint</button>
                  )}
                  {isEditing && (
                    <>
                      <button onClick={handleSaveEdit} className="btn btn-sm btn-primary rounded-none" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-xs"></span> : 'Save Changes'}
                      </button>
                      <button onClick={() => { setIsEditing(false); setEditData({ title: complaint.title, description: complaint.description }); }} className="btn btn-sm btn-ghost rounded-none" disabled={saving}>Cancel</button>
                    </>
                  )}
                  {((isCreator && isSubmitted) || isAdmin) && !isEditing && (
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-sm btn-error btn-outline rounded-none ml-auto" disabled={deleting}>
                      {deleting ? <span className="loading loading-spinner loading-xs"></span> : 'Delete'}
                    </button>
                  )}
                </div>

                {showDeleteConfirm && (
                  <div className="alert alert-error rounded-none flex flex-col items-start gap-2 border-2 mt-4">
                    <span className="font-bold text-sm">Are you sure you want to delete this complaint?</span>
                    <span className="text-xs">This action cannot be undone. All comments will also be deleted.</span>
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleDelete} className="btn btn-xs btn-error rounded-none" disabled={deleting}>
                        {deleting ? <span className="loading loading-spinner loading-xs"></span> : 'Yes, Delete'}
                      </button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-xs btn-ghost rounded-none" disabled={deleting}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-base-content/50 border border-dashed border-base-300 rounded-none">No comments yet.</div>
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
                  <textarea className="textarea textarea-bordered w-full rounded-none h-24 text-sm" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required disabled={loading} />
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary btn-sm rounded-none" disabled={loading || !newComment.trim()}>
                      {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={onClose} disabled={saving || deleting}>close</button></form>
      </dialog>

      {pendingStatusChange && (
        <StatusChangeModal 
          newStatus={pendingStatusChange}
          onClose={() => setPendingStatusChange(null)}
          onConfirm={confirmStatusChange}
        />
      )}
    </>
  );
};

export default ComplaintDetailModal;