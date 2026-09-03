import { useState, useEffect } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const categories = ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other'];
  const statuses = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  // Live update with debounce (waits 400ms after you stop typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, status, category, sort });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, status, category, sort]);

  const handleClear = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setSort('');
  };

  return (
    <div className="card bg-base-100 shadow-sm rounded-none mb-6 border border-base-300">
      <div className="card-body p-4">
        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="form-control flex-1">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">Search</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered input-sm rounded-none w-full" 
              placeholder="Search title or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-control w-full md:w-44">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">Status</span>
            </label>
            <select className="select select-bordered select-sm rounded-none" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-control w-full md:w-44">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">Category</span>
            </label>
            <select className="select select-bordered select-sm rounded-none" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-control w-full md:w-40">
            <label className="label pb-1">
              <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/50">Sort By</span>
            </label>
            <select className="select select-bordered select-sm rounded-none" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <button onClick={handleClear} className="btn btn-ghost btn-sm rounded-none">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;