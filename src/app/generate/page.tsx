'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GeneratePage() {
  const [packageJson, setPackageJson] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate-docs', {
      method: 'POST',
      body: JSON.stringify({ packageJson }),
    });
    const data = await res.json();
    setGeneratedDoc(data.content);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gerar Documentos</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea 
          className="w-full h-64 p-4 border rounded text-black"
          placeholder="Cole seu package.json"
          value={packageJson}
          onChange={(e) => setPackageJson(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar'}
        </button>
      </form>
      {generatedDoc && (
        <div className="mt-8 prose lg:prose-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedDoc}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
