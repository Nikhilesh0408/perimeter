import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [isNewOrganization, setIsNewOrganization] = useState(true);
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double-submit
    setError('');
    setLoading(true);

    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        organizationName,
        isNewOrganization,
        joinCode: isNewOrganization ? undefined : joinCode,
      });

      console.log('FULL RESPONSE:', registerResponse.data);

      if (isNewOrganization) {
        setSuccessCode(registerResponse.data.organization.join_code);
        return;
      }

      await proceedToLogin();
    } catch (err) {
      console.log('REGISTER ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToLogin = async () => {
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', loginResponse.data.token);
    localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

    navigate('/dashboard');
  };

  if (successCode) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-xl font-bold text-slate-900">
            Perimeter <span className="text-amber-600">•</span>
          </h1>
        </header>
        <div className="flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-sm text-center">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Your company is set up 🎉</h2>
              <p className="text-sm text-slate-500 mb-4">
                Share this join code with your colleagues so they can join your company on Perimeter.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3 mb-6">
                <span className="text-2xl font-mono font-bold text-amber-700 tracking-wider">
                  {successCode}
                </span>
              </div>
              <button
                onClick={proceedToLogin}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded transition"
              >
                Continue to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">
          Perimeter <span className="text-amber-600">•</span>
        </h1>
      </header>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-sm">Create your account</p>
          </div>

          <div className="flex border border-slate-200 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsNewOrganization(true)}
              className={`flex-1 text-sm font-medium py-2 rounded transition ${
                isNewOrganization ? 'bg-amber-600 text-white' : 'text-slate-600'
              }`}
            >
              New company
            </button>
            <button
              type="button"
              onClick={() => setIsNewOrganization(false)}
              className={`flex-1 text-sm font-medium py-2 rounded transition ${
                !isNewOrganization ? 'bg-amber-600 text-white' : 'text-slate-600'
              }`}
            >
              Join existing company
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Jane Doe"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Acme Corp"
              />
            </div>

            {!isNewOrganization && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Join code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="X7K9-QP2M"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Ask a colleague at your company for this code.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="you@company.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;