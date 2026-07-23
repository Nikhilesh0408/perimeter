import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          Perimeter <span className="text-amber-600">•</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition px-4 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
          Know your vendor risk<br />before it becomes your problem
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
          Perimeter continuously monitors the vendors your business depends on — turning
          a one-time compliance checkbox into a living, real-time risk intelligence system.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/register')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded transition"
          >
            Start monitoring vendors
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-slate-300 hover:border-slate-400 text-slate-700 font-medium px-6 py-3 rounded transition"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* Why Perimeter section */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">
          Why businesses need this
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Continuous monitoring</h4>
            <p className="text-sm text-slate-500">
              No more one-time onboarding checks. Vendors are re-assessed automatically
              as new risk signals emerge.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">AI-driven risk scoring</h4>
            <p className="text-sm text-slate-500">
              A trained model estimates each vendor's failure probability — working even
              for small vendors with no public footprint.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Early alerts</h4>
            <p className="text-sm text-slate-500">
              Get notified the moment a vendor's risk profile changes — a breach, a
              sanctions hit, or a financial red flag.
            </p>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">About Perimeter</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Built by <span className="font-medium text-slate-700">CodeCulture</span>, Perimeter
            helps procurement, compliance, and security teams move beyond spreadsheets and
            one-time vendor checks. Every vendor your business depends on — from cloud
            providers to logistics partners — is a risk you don't fully control. Perimeter
            gives you visibility into that risk before it becomes a problem.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Ready to see your vendor risk clearly?
        </h3>
        <button
          onClick={() => navigate('/register')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded transition"
        >
          Get started for free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-6 text-center text-sm text-slate-400">
        Perimeter by CodeCulture — CIF Hackathon 2026
      </footer>
    </div>
  );
}

export default Landing;