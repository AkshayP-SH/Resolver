import { useState } from 'react';
import { createComplaint } from '../services/api';

export default function NewComplaintForm({ onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      await createComplaint(formData);
      setSuccess(true);
      setFormData({ title: '', description: '', category: '', location: '', priority: 'MEDIUM' });
      if (onCreated) onCreated(); 
    } catch (err) {
      setError(err.message || 'Failed to create complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">File a Complaint</h1>
          <p className="text-base-content/60 text-sm leading-relaxed">
            Provide as much detail as possible. Accurate categorization and priority selection help our staff resolve issues faster.
          </p>
        </div>
        
        <div className="border border-base-300 p-4 bg-base-200/30 rounded-none mt-4">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-base-content/70">Priority Guidelines</h3>
          <ul className="space-y-3 text-xs text-base-content/80">
            <li><span className="font-bold text-error">URGENT:</span> Immediate threat to safety or critical infrastructure failure.</li>
            <li><span className="font-bold text-warning">HIGH:</span> Major disruption affecting multiple users or areas.</li>
            <li><span className="font-bold text-info">MEDIUM:</span> Standard issue requiring timely attention.</li>
            <li><span className="font-bold text-base-content/50">LOW:</span> Minor inconvenience or cosmetic issue.</li>
          </ul>
        </div>
      </div>

      <div className="lg:col-span-8">
        {success && <div className="alert alert-success rounded-none mb-4 border-0"><span>Complaint filed successfully!</span></div>}
        {error && <div className="alert alert-error rounded-none mb-4 border-0"><span>{error}</span></div>}

        <div className="border border-base-300 bg-base-100 rounded-none">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Title</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered rounded-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary" placeholder="e.g., Broken streetlight on Main St" required />
              </div>

              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Category</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered rounded-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary" required>
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Priority</span></label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="select select-bordered rounded-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary">
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Location (Optional)</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input input-bordered rounded-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary" placeholder="Building, floor, or street address" />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label pb-2"><span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Description</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered rounded-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary h-32 resize-none" placeholder="Describe the issue in detail..." required />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-base-300">
              <button type="submit" className="btn btn-primary rounded-none min-w-40" disabled={submitting}>
                {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}