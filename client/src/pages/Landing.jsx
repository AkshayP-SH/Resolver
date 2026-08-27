import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 relative">
      
      <nav className="navbar bg-base-300 shadow-sm px-8 py-4">

        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-4xl font-black tracking-tighter rounded-none p-0"> RESOLVER </Link>
        </div>

          

        <div className="flex-none flex items-center gap-4">
          <ThemeToggle />

          <button className="btn btn-outline btn-sm rounded-none px-4 tracking-wide"> Anonymous Report </button>

          <div className="divider divider-horizontal m-0"></div>

          <Link to="/login" className="btn btn-ghost btn-sm rounded-none px-4 tracking-wide"> Sign In </Link>

          <Link to="/register" className="btn btn-primary btn-sm rounded-none px-4 tracking-wide"> Create Account </Link>
        </div>
      </nav>

      <main className="hero flex-1 relative">
       
        <div className="hero-content text-center">
          <div className="max-w-3xl">

            <h1 className="text-6xl font-black tracking-tight leading-tight"> Track complaints.<br />Resolve faster. </h1>
            <p className="py-8 text-xl text-base-content/60 leading-relaxed">
              A streamlined digital portal for filing, tracking, and resolving complaints efficiently.
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <Link to="/register" className="btn btn-primary btn-lg rounded-none px-10 tracking-wide"> Create Account </Link>
              <Link to="/login" className="btn btn-outline btn-lg rounded-none px-10 tracking-wide"> Sign In </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}