import { useState } from 'react';
import { showToast } from '../services/toast';

export default function StatusChangeModal({ newStatus, onClose, onConfirm }) {
  const [explanation, setExplanation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!explanation.trim()) {
      showToast('Please provide an explanation', 'error');
      return;
    }
    onConfirm(explanation);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-11/12 max-w-lg rounded-none border border-base-300 p-0">
        <div className="flex items-center justify-between border-b border-base-300 p-4 bg-base-200/30">
          <h3 className="font-black text-lg tracking-tight uppercase">Status Change</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-square rounded-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-base-content/70">
            You are changing the status to <span className="font-bold text-primary">{newStatus}</span>. Please provide a brief explanation.
          </p>
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text font-bold uppercase text-xs tracking-wider text-base-content/70">Explanation</span>
            </label>
            <textarea
              className="textarea textarea-bordered rounded-none h-32 bg-base-200/40"
              placeholder="e.g., Issue resolved after replacing the faulty part..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm rounded-none">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm rounded-none hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">Confirm & Update</button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}