import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddVendor() {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');

  // Financial inputs for risk scoring
  const [roaC, setRoaC] = useState('');
  const [operatingGrossMargin, setOperatingGrossMargin] = useState('');
  const [currentRatio, setCurrentRatio] = useState('');
  const [quickRatio, setQuickRatio] = useState('');
  const [debtRatio, setDebtRatio] = useState('');
  const [netIncomeToTotalAssets, setNetIncomeToTotalAssets] = useState('');
  const [workingCapitalToTotalAssets, setWorkingCapitalToTotalAssets] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/vendors', {
        name,
        industry,
        years_in_business: yearsInBusiness ? Number(yearsInBusiness) : null,
        employee_count: employeeCount ? Number(employeeCount) : null,
        roa_c: roaC ? Number(roaC) : undefined,
        operating_gross_margin: operatingGrossMargin ? Number(operatingGrossMargin) : undefined,
        current_ratio: currentRatio ? Number(currentRatio) : undefined,
        quick_ratio: quickRatio ? Number(quickRatio) : undefined,
        debt_ratio: debtRatio ? Number(debtRatio) : undefined,
        net_income_to_total_assets: netIncomeToTotalAssets ? Number(netIncomeToTotalAssets) : undefined,
        working_capital_to_total_assets: workingCapitalToTotalAssets ? Number(workingCapitalToTotalAssets) : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          Perimeter <span className="text-amber-600">•</span>
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-slate-500 hover:text-slate-900 transition"
        >
          Back to dashboard
        </button>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Add a new vendor</h2>
        <p className="text-sm text-slate-500 mb-6">
          Onboard a vendor to start tracking their risk profile.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Acme Logistics Pvt Ltd"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Logistics, IT Services, Manufacturing..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years in business</label>
              <input
                type="number"
                min="0"
                value={yearsInBusiness}
                onChange={(e) => setYearsInBusiness(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee count</label>
              <input
                type="number"
                min="0"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="120"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Financial ratios (optional)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide these to generate an AI-powered risk score. Values should be between 0 and 1.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">ROA (profitability)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={roaC}
                onChange={(e) => setRoaC(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Operating gross margin</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={operatingGrossMargin}
                onChange={(e) => setOperatingGrossMargin(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Current ratio</label>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={currentRatio}
                onChange={(e) => setCurrentRatio(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.005"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quick ratio</label>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={quickRatio}
                onChange={(e) => setQuickRatio(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.003"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Debt ratio</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={debtRatio}
                onChange={(e) => setDebtRatio(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Net income / total assets</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={netIncomeToTotalAssets}
                onChange={(e) => setNetIncomeToTotalAssets(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0.70"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-700 mb-1">Working capital / total assets</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={workingCapitalToTotalAssets}
              onChange={(e) => setWorkingCapitalToTotalAssets(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="0.65"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Adding vendor...' : 'Add vendor'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVendor;