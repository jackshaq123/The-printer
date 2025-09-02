"use client";
import { useEffect, useMemo, useState } from 'react';

const ENV = {
  SITE_NAME: 'The Printer',
  N8N_BASE: 'https://jackshaq001.app.n8n.cloud',
  WEBHOOK_SAVE: '/webhook/collect',
  WEBHOOK_META: '/webhook/meta/facebook',
  WEBHOOK_TIKTOK: '/webhook/meta/tiktok',
  FB_APP_ID: '2587173781650114',
  FB_REDIRECT_URI: 'https://oauth.n8n.cloud/oauth2/callback',
  FB_SCOPES: ['ads_management','business_management','pages_show_list','leads_retrieval'].join(','),
  TIKTOK_APP_ID: 'YOUR_TIKTOK_APP_ID',
  TIKTOK_REDIRECT_URI: 'https://oauth.n8n.cloud/oauth2/callback',
  TIKTOK_SCOPES: ['ad.manage','ad.report','business.manage','pixel.manage'].join(','),
};

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

export default function ConnectAndLaunch() {
  const [sessionId, setSessionId] = useState('');
  const [productName, setProductName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // initialize session
  useEffect(() => {
    let stored = localStorage.getItem('tp_session');
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem('tp_session', stored);
    }
    setSessionId(stored);

    const loadUrl = new URL(`${ENV.N8N_BASE}${ENV.WEBHOOK_SAVE}`);
    loadUrl.searchParams.set('session_id', stored);
    fetch(loadUrl.toString())
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.product_name) setProductName(data.product_name);
          if (data.product_link) setProductLink(data.product_link);
          if (data.daily_budget) setDailyBudget(String(data.daily_budget));
        }
      })
      .catch(() => {});
  }, []);

  const metaAuthUrl = useMemo(() => {
    if (!sessionId) return '#';
    const url = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    url.searchParams.set('client_id', ENV.FB_APP_ID);
    url.searchParams.set('redirect_uri', ENV.FB_REDIRECT_URI);
    url.searchParams.set('state', sessionId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', ENV.FB_SCOPES);
    return url.toString();
  }, [sessionId]);

  const tiktokAuthUrl = useMemo(() => {
    if (!sessionId) return '#';
    const url = new URL('https://ads.tiktok.com/marketing_api/auth');
    url.searchParams.set('app_id', ENV.TIKTOK_APP_ID);
    url.searchParams.set('redirect_uri', ENV.TIKTOK_REDIRECT_URI);
    url.searchParams.set('state', sessionId);
    url.searchParams.set('scope', ENV.TIKTOK_SCOPES);
    return url.toString();
  }, [sessionId]);

  const metaPassthrough = useMemo(() => {
    if (!sessionId) return '#';
    const url = new URL(`${ENV.N8N_BASE}${ENV.WEBHOOK_META}`);
    url.searchParams.set('chat_id', sessionId);
    return url.toString();
  }, [sessionId]);

  const tiktokPassthrough = useMemo(() => {
    if (!sessionId) return '#';
    const url = new URL(`${ENV.N8N_BASE}${ENV.WEBHOOK_TIKTOK}`);
    url.searchParams.set('chat_id', sessionId);
    return url.toString();
  }, [sessionId]);

  function validate() {
    if (!productName.trim()) {
      setMessage('Product name is required.');
      return false;
    }
    if (productLink) {
      try {
        new URL(productLink);
      } catch {
        setMessage('Product link must be a valid URL.');
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setStatus('error');
      return;
    }
    setStatus('saving');
    setMessage('Saving...');
    try {
      const res = await fetch(`${ENV.N8N_BASE}${ENV.WEBHOOK_SAVE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          product_name: productName,
          product_link: productLink || null,
          daily_budget: dailyBudget ? Number(dailyBudget) : null,
          platform: 'web',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json().catch(() => ({}));
      if (data.product_name) setProductName(data.product_name);
      if (data.product_link) setProductLink(data.product_link);
      if (data.daily_budget) setDailyBudget(String(data.daily_budget));
      setStatus('success');
      setMessage('Saved!');
    } catch {
      setStatus('error');
      setMessage('Failed to save.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{ENV.SITE_NAME}</h1>
          <p className="text-gray-600">Create AI videos and launch ads in minutes</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              id="product_name"
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="product_link" className="block text-sm font-medium text-gray-700">Product Link</label>
            <input
              id="product_link"
              type="url"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="daily_budget" className="block text-sm font-medium text-gray-700">Daily Budget (USD)</label>
            <input
              id="daily_budget"
              type="number"
              min="0"
              step="0.01"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e.target.value)}
              className="mt-1 w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save & Continue
          </button>
          <div aria-live="polite" className="min-h-[1.5rem] text-center text-sm">
            {status === 'success' && <span className="text-green-600">{message}</span>}
            {status === 'error' && <span className="text-red-600">{message}</span>}
            {status === 'saving' && <span className="text-gray-600">{message}</span>}
          </div>
        </form>
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <a
              href={metaAuthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Connect Meta
            </a>
            <a
              href={metaPassthrough}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-blue-600 underline"
            >
              Meta passthrough
            </a>
          </div>
          <div className="text-center">
            <a
              href={tiktokAuthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Connect TikTok
            </a>
            <a
              href={tiktokPassthrough}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-blue-600 underline"
            >
              TikTok passthrough
            </a>
          </div>
        </div>
        <footer className="mt-8 text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-2">
            <span>Session: {sessionId ? `${sessionId.slice(0, 8)}...` : ''}</span>
            {sessionId && (
              <button
                type="button"
                onClick={() => copyToClipboard(sessionId)}
                className="underline"
              >
                Copy
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('tp_session');
              window.location.reload();
            }}
            className="underline mt-1"
          >
            Reset session
          </button>
        </footer>
      </div>
    </div>
  );
}
