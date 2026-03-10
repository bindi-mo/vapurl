import { useEffect, useState } from 'react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('vapurl_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = async () => {
    if (!apiKey || !targetUrl || !customId) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setResultUrl('');

    try {
      const apiEndpoint = '/api/create';
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: customId, url: targetUrl })
      });

      const data = await response.json() as { short_url?: string; error?: string };

      if (response.ok) {
        localStorage.setItem('vapurl_api_key', apiKey);
        setResultUrl(data.short_url || '');
      } else {
        setError(data.error || 'Failed to create link');
      }
    } catch (_err) {
      setError('Network error or Workers not reachable');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultUrl);
    // Simple feedback
    const btn = document.getElementById('copyBtn') as HTMLButtonElement | null;
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Done!';
      setTimeout(() => btn.textContent = originalText, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f8fafc' }}>
      <div className="max-w-md w-full glass p-8 rounded-2xl shadow-xl border border-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Vapurl</h1>
          <p className="text-slate-500 mt-2 font-medium">Shorten in a Mist.</p>
        </div>

        <div className="space-y-4">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API_KEY"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <p className="text-[10px] text-slate-400 mt-1">※ Saved locally in your browser.</p>
          </div>

          {/* Original URL Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Original URL</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com/very-long-path"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Custom ID Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Custom ID</label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="my-link"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Vapurl'}
          </button>
        </div>

        {/* Result Display */}
        {resultUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-1">Success! Your link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={resultUrl}
                readOnly
                className="flex-1 bg-white border border-green-300 rounded px-2 py-1 text-sm text-slate-700"
              />
              <button
                type="button"
                id="copyBtn"
                onClick={copyToClipboard}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}