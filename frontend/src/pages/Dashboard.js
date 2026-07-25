import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/vendors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(response.data.vendors);
    } catch (err) {
      setError('Failed to load vendors.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Summary stats
  const totalVendors = vendors.length;
  const highRiskCount = vendors.filter((v) => v.risk_tier === 'high').length;
  const mediumRiskCount = vendors.filter((v) => v.risk_tier === 'medium').length;
  const lowRiskCount = vendors.filter((v) => v.risk_tier === 'low').length;
  const unscoredCount = vendors.filter((v) => !v.risk_tier).length;

  const tierBadge = (tier) => {
    if (tier === 'high') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">High</span>;
    }
    if (tier === 'medium') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Medium</span>;
    }
    if (tier === 'low') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Low</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Not scored</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          Perimeter <span className="text-amber-600">•</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-900 transition"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats cards row - fills space and gives real signal at a glance */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Total vendors</p>
            <p className="text-2xl font-bold text-slate-900">{totalVendors}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">High risk</p>
            <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Medium risk</p>
            <p className="text-2xl font-bold text-amber-600">{mediumRiskCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Low risk</p>
            <p className="text-2xl font-bold text-green-600">{lowRiskCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Not scored</p>
            <p className="text-2xl font-bold text-slate-400">{unscoredCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Vendors</h2>
          <button
            onClick={() => navigate('/add-vendor')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded transition"
          >
            + Add vendor
          </button>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading vendors...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && vendors.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center">
            <p className="text-slate-500 text-sm">No vendors yet. Add your first vendor to get started.</p>
          </div>
        )}

        {!loading && vendors.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Years</th>
                  <th className="px-4 py-3 font-medium">Employees</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Risk Tier</th>
                  <th className="px-4 py-3 font-medium">Onboarded</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-medium">{v.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.industry || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{v.years_in_business ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{v.employee_count ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {v.risk_score !== null && v.risk_score !== undefined ? `${v.risk_score}%` : '—'}
                    </td>
                    <td className="px-4 py-3">{tierBadge(v.risk_tier)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(v.onboarded_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;