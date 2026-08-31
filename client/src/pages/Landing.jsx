/* import { Link } from 'react-router-dom';
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
} */

  import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">

      {/*NAVBAR*/}
      <nav className="border-b border-base-300 px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <Link 
            to="/" 
            className="text-xl font-black tracking-tighter"
          >
            RESOLVER
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="w-px h-6 bg-base-300 mx-1"></div>

            <Link 
              to="/login" 
              className="btn btn-ghost btn-sm rounded-none"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="btn btn-primary btn-sm rounded-none"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 flex items-center max-w-6xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">

          <div className="lg:col-span-3">
            
            <p className="text-xs font-semibold uppercase tracking-widest text-primary animate-fade-in-up">
              Digital Complaint Portal
            </p>

            <h1 className="text-6xl font-black tracking-tight leading-[1.05] mt-4 animate-fade-in-up delay-1">
              Track complaints.
              <br />
              Resolve faster.
            </h1>
            {/* meh debatable think of something else*/}
            <p className="text-lg text-base-content/60 mt-6 max-w-md leading-relaxed animate-fade-in-up delay-2">
              File a complaint in 30 seconds. Get assigned to staff 
              in minutes. Track every step until it's resolved.
            </p>

            <div className="flex gap-4 mt-10 animate-fade-in-up delay-3">
              <Link 
                to="/register" 
                className="btn btn-primary rounded-none px-8"
              >
                Create Account
              </Link>
              <button className="btn btn-outline rounded-none px-8">
                Report Anonymously
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 lg:pt-8">
            
            <div className="border border-base-300 bg-base-100 p-6 animate-fade-in-up delay-2">
              <p className="text-4xl font-black tracking-tight">pull from complaints api</p>
              <p className="text-sm text-base-content/50 mt-1">Complaints resolved</p>
            </div>

            <div className="border border-base-300 bg-base-100 p-6 animate-fade-in-up delay-3">
              <p className="text-4xl font-black tracking-tight">0.001 sec</p>
              <p className="text-sm text-base-content/50 mt-1">Average resolution time</p>
            </div>

            {/* <div className="border border-base-300 bg-base-100 p-6 animate-fade-in-up delay-4">
              <p className="text-4xl font-black tracking-tight">0%</p>
              <p className="text-sm text-base-content/50 mt-1">User satisfaction</p>
            </div> */}
          </div>
        </div>
      </section>


      <footer className="border-t border-base-300">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <span className="text-sm text-base-content/40">
            © 2025 Resolver
          </span>
          <div className="flex gap-6 text-sm text-base-content/40">
            {/* <a href="#" className="hover:text-base-content">Privacy</a>
            <a href="#" className="hover:text-base-content">Terms</a>
            <a href="#" className="hover:text-base-content">Contact</a> */}
            <a href="#" className="hover:text-base-content">idk what to put here</a>
          </div>
        </div>
      </footer>
    </div>
  );
}