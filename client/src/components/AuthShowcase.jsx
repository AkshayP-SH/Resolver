import { Link } from 'react-router-dom';

export default function AuthShowcase() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-base-100 border-r border-base-300 relative overflow-hidden">

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-auth" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-auth)" />
        </svg>
      </div>

      <Link to="/" className="flex items-center gap-3 z-10 w-fit">
        <img src="/favicon.svg" alt="Resolver" className="w-8 h-8" />
        <span className="text-2xl font-black tracking-tighter">RESOLVER</span>
      </Link>

      <div className="z-10 space-y-12 py-12">
        <h2 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
          Every complaint.<br />
          <span className="text-base-content/40">Tracked.</span><br />
          Resolved.
        </h2>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="text-primary">01</span>
            <span>File</span>
          </div>
          <svg className="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          <div className="flex items-center gap-2">
            <span className="text-primary">02</span>
            <span>Assign</span>
          </div>
          <svg className="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          <div className="flex items-center gap-2">
            <span className="text-primary">03</span>
            <span>Resolve</span>
          </div>
        </div>

        <div className="animate-float relative w-full max-w-md">
          <div className="absolute inset-0 translate-x-4 translate-y-4 border border-base-300 bg-base-200/60"></div>
          <div className="relative bg-base-200 border border-base-300 p-6 shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="badge badge-error rounded-none badge-sm">URGENT</span>
              <span className="badge badge-primary rounded-none badge-sm text-[10px]">IN PROGRESS</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Water leak in basement level 2</h3>
            <div className="flex items-center gap-2 text-xs text-base-content/60 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Main Building, Sector 4</span>
            </div>
            <div className="border-t border-base-300 pt-3 mb-4">
              <div className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mb-2">Status Timeline</div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1/4 bg-success rounded-none"></div>
                <div className="h-1.5 w-1/4 bg-primary rounded-none"></div>
                <div className="h-1.5 w-1/2 bg-base-300 rounded-none"></div>
              </div>
            </div>
            <div className="border-t border-base-300 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-base-300 flex items-center justify-center text-[10px] font-black">ST</div>
                <div>
                  <p className="text-xs font-semibold">Plumber assigned, on site today.</p>
                  <p className="text-[10px] text-base-content/40">Staff · 2h ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-base-content/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                12
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-10">
        <p className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mb-3">Categories tracked</p>
        <div className="flex flex-wrap gap-2">
          {['Infrastructure', 'Electricity', 'Water', 'Sanitation', 'Safety', 'IT'].map((cat) => (
            <span key={cat} className="badge badge-outline rounded-none badge-sm text-base-content/60">{cat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}