import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="flex justify-between items-center px-8 py-4 bg-base-200 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Resolver" className="w-6 h-6" />
          <span className="text-xl font-black tracking-tighter">RESOLVER</span>
        </Link>
        <ThemeToggle />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">Privacy Policy</h1>
          <p className="text-base-content/60 mt-2">Last updated: September 10, 2026</p>
        </div>

        <Section title="1. What We Collect">
          <p>When you create an account, we collect your name, email address, and a hashed version of your password (never the plain text). If you choose to sign in with Google, we receive your name, email address, and Google account ID from Google. When you use the platform, we store the complaints you submit (including descriptions, categories, locations, and any file attachments you upload), comments you post, upvotes, and in-app notification preferences.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>Your data is used solely to operate the complaint management system: displaying complaints to authorized users, assigning and tracking complaint status, sending in-app notifications, and — if you opt in — sending transactional emails (password resets and status updates) via our email provider, Brevo. We do not sell your data or use it for advertising.</p>
        </Section>

        <Section title="3. Third-Party Services">
          <p>To operate, we rely on a small number of processors: MongoDB Atlas (database), Render (backend hosting), Vercel (frontend hosting), Brevo (transactional email), and Google (only if you use Google Sign-In). Each processes data under its own privacy policy.</p>
        </Section>

        <Section title="4. Cookies & Local Storage">
          <p>We use a strictly necessary HTTP-only cookie (or, on browsers that block cross-site cookies such as Safari, a locally stored session token) to keep you logged in. We do not use tracking cookies or third-party advertising cookies.</p>
        </Section>

        <Section title="5. Data Retention & Deletion">
          <p>Your account and complaint data are retained until you delete them or request deletion. You may delete your own submitted complaints while they are in Submitted or Rejected status. To request full account deletion, contact us at the email below and we will remove your data.</p>
        </Section>

        <Section title="6. Security">
          <p>Passwords are hashed with bcrypt, sessions are issued as signed JWTs, file uploads are limited to 5MB, and all traffic is served over HTTPS. No system is perfectly secure, but we follow industry-standard practices to protect your data.</p>
        </Section>

        <Section title="7. Contact">
          <p>Questions about this policy? Contact: akshayrajesh278@gmail.com</p>
        </Section>

        <div className="pt-4 border-t border-base-300">
          <Link to="/" className="btn btn-primary btn-sm rounded-none">Back to Home</Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="card bg-base-100 border border-base-300 rounded-none">
      <div className="card-body p-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary">{title}</h2>
        <div className="text-sm leading-relaxed text-base-content/80 space-y-2">{children}</div>
      </div>
    </section>
  );
}