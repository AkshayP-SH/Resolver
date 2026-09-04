import { useState } from 'react';
import { createComplaint } from '../services/api';
import { showToast } from '../services/toast';

const priorityInfo = {
  LOW: 'Minor inconvenience or cosmetic issue.',
  MEDIUM: 'Standard issue requiring timely attention.',
  HIGH: 'Major disruption affecting multiple users or areas.',
  URGENT: 'Immediate threat to safety or critical infrastructure failure.',
};

const prioritySelectedCls = {
  LOW: 'border-base-content/40 bg-base-200 text-base-content',
  MEDIUM: 'border-info bg-info/10 text-info',
  HIGH: 'border-warning bg-warning/10 text-warning',
  URGENT: 'border-error bg-error/10 text-error',
};

export default function NewComplaintForm({ onCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'MEDIUM',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createComplaint(formData);
      showToast('Complaint filed successfully', 'success');
      setFormData({ title: '', description: '', category: '', location: '', priority: 'MEDIUM' });
      if (onCreated) onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to create complaint', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // block label + w-full input = label on top, field stretches edge to edge
  const labelCls = 'block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2';
  const fieldCls = 'input input-bordered rounded-none w-full bg-base-200/40 border-base-300 focus:outline-none focus:border-primary';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">File a Complaint</h1>
        <p className="text-base-content/60 mt-2">Be specific. Good details help staff resolve it faster.</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-base-300 bg-base-100 rounded-none p-6 md:p-8 space-y-6 animate-fade-in-up delay-1">

        {/* title: label on top, full width */}
        <div>
          <label className={labelCls}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={fieldCls}
            placeholder="e.g., Broken streetlight on Main St"
            required
          />
        </div>

        {/* category + location stay side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered rounded-none w-full bg-base-200/40 border-base-300 focus:outline-none focus:border-primary"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Location (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={fieldCls}
              placeholder="Building, floor, or street address"
            />
          </div>
        </div>

        {/* priority segmented */}
        <div>
          <label className={labelCls}>Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(priorityInfo).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({ ...formData, priority: p })}
                className={`border px-2 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none transition-all duration-200 ${
                  formData.priority === p
                    ? prioritySelectedCls[p]
                    : 'border-base-300 text-base-content/50 hover:bg-base-200/50 hover:text-base-content'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="text-xs text-base-content/50 mt-2">{priorityInfo[formData.priority]}</p>
        </div>

        {/* description: label on top, full width */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered rounded-none w-full h-36 resize-none bg-base-200/40 border-base-300 focus:outline-none focus:border-primary"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-base-300">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary rounded-none min-w-44 font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}