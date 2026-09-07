import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="animate-fade-in-up">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/60 mb-4">Error 404</p>
          <h1 className="text-8xl font-black tracking-tighter text-base-content">404</h1>
          <p className="text-xl font-bold tracking-tight mt-4">Page not found</p>
          <p className="text-base-content/60 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Link
          to="/"
          className="btn btn-primary rounded-none mt-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}