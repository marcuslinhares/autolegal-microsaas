'use server';

import { analyzePackageJson } from '@/services/analyzer';
import { analyzeApiRoutes } from '@/services/apiScanner';
import { generateLegalClauseRecommendations } from '@/services/legalClauseGenerator';
import { generateLegalDocumentContent } from '@/services/aiGenerator';

export async function generateDocsAction(packageJson: string) {
  try {
    if (!packageJson) {
      throw new Error('package.json is required');
    }

    // 1. Analyze package.json
    const pkgAnalysis = analyzePackageJson(packageJson);

    // 2. Analyze API routes
    const projectRoot = process.cwd();
    const apiAnalysis = await analyzeApiRoutes(projectRoot);

    // 3. Generate recommendations
    const recommendations = generateLegalClauseRecommendations(pkgAnalysis, apiAnalysis);

    // 4. Generate document content
    const document = await generateLegalDocumentContent(
      'Termos de Uso e Política de Privacidade',
      recommendations,
      `Detected ${pkgAnalysis.legalClauses.length} legal requirements.`
    );

    return { success: true, content: document.content };
  } catch (error: any) {
    console.error('Error in generateDocsAction:', error);
    return { success: false, error: error.message || 'Internal Server Error' };
  }
}
