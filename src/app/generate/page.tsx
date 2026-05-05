'use client';
import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

type RiskLevel = 'low' | 'medium' | 'high';

interface GenerationMetadata {
  title: string;
  riskLevel: RiskLevel;
  aiModelUsed: string;
  timestamp: string;
  dependencies: string[];
  legalClauses: string[];
}

interface ApiError {
  error: string;
}

function validatePackageJson(text: string): string | null {
  if (!text.trim()) {
    return 'Please paste your package.json content.';
  }
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') {
      return 'The content is not a valid JSON object.';
    }
    if (!parsed.dependencies && !parsed.devDependencies) {
      return 'No "dependencies" or "devDependencies" found in package.json.';
    }
    return null;
  } catch {
    return 'Invalid JSON format. Please check your package.json syntax.';
  }
}

export default function GeneratePage() {
  const [packageJson, setPackageJson] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPackageJson(value);
    // Clear validation error while typing
    if (validationError) setValidationError(null);
  }, [validationError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGeneratedDoc(null);
    setMetadata(null);

    // Client-side validation
    const validationErr = validatePackageJson(packageJson);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageJson }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as ApiError).error || `Server error (${res.status})`);
      }

      setGeneratedDoc(data.content);
      setMetadata(data.metadata);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate documents. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [packageJson]);

  const riskBadge = (level: RiskLevel) => {
    const colors: Record<RiskLevel, string> = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors">
            AutoLegal
          </Link>
          <span className="text-sm text-slate-400">Legal Document Generator</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Generate Legal Documents</h1>
        <p className="text-slate-600 mb-10 text-lg">
          Paste your project&apos;s <code className="rounded bg-slate-200 px-2 py-0.5 text-sm font-mono">package.json</code>{' '}
          below to get tailored legal clauses based on your dependencies.
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Input Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="package-json" className="block text-sm font-medium text-slate-700 mb-2">
                  package.json
                </label>
                <textarea
                  id="package-json"
                  className={`w-full h-80 p-4 border-2 rounded-xl font-mono text-sm bg-white shadow-sm transition-colors resize-y ${
                    validationError
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:ring-4 outline-none`}
                  placeholder={'{\n  "dependencies": {\n    "stripe": "^14.0.0",\n    "next-auth": "^4.0.0",\n    "prisma": "^5.0.0"\n  }\n}'}
                  value={packageJson}
                  onChange={handleInputChange}
                  spellCheck={false}
                />
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {validationError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !packageJson.trim()}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing & Generating...
                  </>
                ) : (
                  'Generate Documents'
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">❌</span>
                  <div>
                    <p className="font-semibold">Generation Failed</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Documents</h2>
              {metadata && riskBadge(metadata.riskLevel)}
            </div>

            {loading && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto" />
                </div>
                <p className="text-slate-400 mt-6 text-sm">Scanning dependencies and generating clauses...</p>
              </div>
            )}

            {!loading && !generatedDoc && !error && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-slate-400 text-lg font-medium">No documents generated yet</p>
                <p className="text-slate-400 text-sm mt-1">
                  Paste your package.json and click generate to get started.
                </p>
              </div>
            )}

            {generatedDoc && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm prose prose-slate prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedDoc}</ReactMarkdown>
                </div>

                {/* Metadata footer */}
                {metadata && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
                    <p>Generated: {new Date(metadata.timestamp).toLocaleString()}</p>
                    <p>Dependencies scanned: {metadata.dependencies.length}</p>
                    <p>Clauses suggested: {metadata.legalClauses.length}</p>
                    <p>AI Model: {metadata.aiModelUsed}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
