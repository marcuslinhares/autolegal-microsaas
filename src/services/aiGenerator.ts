import { LegalClauseRecommendation } from './legalClauseGenerator';

export interface GeneratedDocument {
  title: string;
  content: string;
  aiModelUsed: string;
  timestamp: string;
}

export async function generateLegalDocumentContent(
  documentTitle: string,
  recommendations: LegalClauseRecommendation[],
  projectContext: string = '',
  projectName: string = 'AutoLegal MicroSaaS'
): Promise<GeneratedDocument> {
  const simulatedContent = `
# ${documentTitle}
Este documento foi gerado automaticamente para o projeto ${projectName}.
${recommendations.map(rec => `## ${rec.clause}\n${rec.reason}`).join('\n\n')}
**AVISO LEGAL:** Rascunho gerado por IA.
  `;

  return {
    title: documentTitle,
    content: simulatedContent,
    aiModelUsed: 'Simulated AI',
    timestamp: new Date().toISOString(),
  };
}
