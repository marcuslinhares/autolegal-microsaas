export interface AnalysisResult {
  dependencies: string[];
  legalClauses: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export function analyzePackageJson(content: string): AnalysisResult {
  return { dependencies: [], legalClauses: [], riskLevel: 'low' };
}
