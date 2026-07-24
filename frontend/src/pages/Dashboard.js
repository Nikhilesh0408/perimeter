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

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Vendors</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{vendors.length} total</span>
            <button
              onClick={() => navigate('/add-vendor')}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded transition"
            >
              + Add vendor
            </button>
          </div>
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading vendors...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && vendors.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-lg p-10 text-center">
            <p className="text-slate-500 text-sm">No vendors yet. Add your first vendor to get started.</p>
          </div>
        )}

        {!loading && vendors.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Years in Business</th>
                  <th className="px-4 py-3 font-medium">Employees</th>
                  <th className="px-4 py-3 font-medium">Onboarded</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-900 font-medium">{v.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.industry || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{v.years_in_business ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{v.employee_count ?? '—'}</td>
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