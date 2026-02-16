'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateDocsAction } from '../actions';

export default function GeneratePage() {
  const [packageJson, setPackageJson] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateDocsAction(packageJson);
      if (result.success) {
        setGeneratedDoc(result.content || '');
      } else {
        setError(result.error || 'Erro desconhecido');
      }
    } catch (err) {
      setError('Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
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
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {generatedDoc && (
        <div className="mt-8 prose lg:prose-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedDoc}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
