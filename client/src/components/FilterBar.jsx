import { useState, useEffect } from 'react';

export default function FilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const categories = ['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT', 'Other'];
  const statuses = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

  const activeCount = [search, status, category, sort].filter((v) => v !== '').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, status, category, sort });
    }, 200);
    return () => clearTimeout(timer);
  }, [search, status, category, sort]);

  const handleClear = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setSort('');
  };

  const selectCls = 'h-12 bg-transparent px-4 text-sm font-medium focus:outline-none cursor-pointer hover:bg-base-200/40 transition-colors';

  return (
    <div className="border border-base-300 bg-base-100 mb-6 flex flex-col sm:flex-row sm:items-stretch divide-y sm:divide-y-0 sm:divide-x divide-base-300">

      <div className="relative flex-1">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or description..."
          className="w-full h-12 bg-transparent pl-11 pr-4 text-sm font-medium focus:outline-none placeholder:text-base-content/40"
        />
      </div>

      <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectCls} sm:w-44`}>
        <option value="">Status: All</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${selectCls} sm:w-44`}>
        <option value="">Category: All</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${selectCls} sm:w-40`}>
        <option value="">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="priority">Sort: Priority</option>
      </select>

      {activeCount > 0 && (
        <button
          onClick={handleClear}
          className="h-12 px-4 text-xs font-bold uppercase tracking-widest text-error hover:bg-error/10 transition-colors flex items-center gap-2 justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear{activeCount > 1 ? ` (${activeCount})` : ''}
        </button>
      )}
    </div>
  );
}