import { LegalClauseRecommendation } from './legalClauseGenerator';

export interface GeneratedDocument {
  title: string;
  content: string;
  aiModelUsed: string;
  timestamp: string;
}

function buildPrompt(
  documentTitle: string,
  recommendations: LegalClauseRecommendation[],
  projectContext: string,
  projectName: string
): string {
  const clausesSection = recommendations
    .map(
      (rec, i) =>
        `${i + 1}. **${rec.clause}** (Prioridade: ${rec.priority})\n   Motivo: ${rec.reason}`
    )
    .join('\n\n');

  return `Você é um advogado especialista em direito digital e contratos de software. Gere um documento legal completo e formal em português brasileiro.

TÍTULO DO DOCUMENTO: ${documentTitle}
PROJETO: ${projectName}
CONTEXTO DO PROJETO: ${projectContext}

CLÁUSULAS RECOMENDADAS QUE DEVEM SER INCLUÍDAS:
${clausesSection}

INSTRUÇÕES:
- O documento deve ser escrito em português brasileiro jurídico formal.
- Estruture o documento com as seções apropriadas (preâmbulo, cláusulas, disposições finais).
- Cada cláusula recomendada deve ser desenvolvida em um parágrafo ou seção completa e detalhada.
- Inclua linguagem jurídica apropriada e referências à legislação brasileira quando relevante (LGPD, Marco Civil da Internet, CDC).
- O tom deve ser profissional, formal e juridicamente preciso.
- O documento deve ter aparência de um contrato/termo legal real.

Formate a resposta em Markdown com cabeçalhos, listas e seções bem definidas.`;
}

function generateFallbackContent(
  documentTitle: string,
  recommendations: LegalClauseRecommendation[],
  projectContext: string,
  projectName: string
): GeneratedDocument {
  const content = `# ${documentTitle}

## Preâmbulo

O presente documento estabelece os termos e condições legais aplicáveis ao uso do software **${projectName}** ("Plataforma"), doravante denominado simplesmente "Software".

## Contexto

${projectContext}

## Cláusulas Aplicáveis

${recommendations
  .map(
    (rec) =>
      `### ${rec.clause}\n\n${rec.reason}\n\n*Prioridade: ${rec.priority}*`
  )
  .join('\n\n')}

## Disposições Finais

O presente documento é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca da capital do estado do desenvolvedor para dirimir quaisquer controvérsias oriundas deste instrumento.

---

**AVISO LEGAL:** Este documento foi gerado automaticamente por inteligência artificial e constitui um rascunho preliminar. Recomenda-se a revisão por um advogado habilitado antes de sua utilização oficial.`;

  return {
    title: documentTitle,
    content,
    aiModelUsed: 'Fallback (offline)',
    timestamp: new Date().toISOString(),
  };
}

export async function generateLegalDocumentContent(
  documentTitle: string,
  recommendations: LegalClauseRecommendation[],
  projectContext: string = '',
  projectName: string = 'AutoLegal MicroSaaS'
): Promise<GeneratedDocument> {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'llama3-70b-8192';

  // If no API key is configured, use the fallback generator
  if (!apiKey) {
    console.warn(
      '[aiGenerator] No AI_API_KEY found in environment. Using fallback content generator.'
    );
    return generateFallbackContent(
      documentTitle,
      recommendations,
      projectContext,
      projectName
    );
  }

  try {
    // Dynamic import to avoid build-time bundling issues
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey });

    const prompt = buildPrompt(
      documentTitle,
      recommendations,
      projectContext,
      projectName
    );

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Você é um advogado especialista em direito digital e contratos de software brasileiro. Gere documentos legais formais e completos.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model,
      temperature: 0.3,
      max_tokens: 4096,
    });

    const content =
      chatCompletion.choices[0]?.message?.content?.trim() || '';

    if (!content) {
      throw new Error('LLM returned empty response');
    }

    return {
      title: documentTitle,
      content,
      aiModelUsed: `Groq (${model})`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown AI generation error';
    console.error('[aiGenerator] Groq API call failed:', errorMessage);

    // Fall back to offline content if API call fails
    const fallback = generateFallbackContent(
      documentTitle,
      recommendations,
      projectContext,
      projectName
    );
    return {
      ...fallback,
      aiModelUsed: `Fallback (${model} failed: ${errorMessage})`,
    };
  }
}
