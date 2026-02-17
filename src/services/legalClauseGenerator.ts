import { AnalysisResult } from './analyzer';
import { ApiRouteAnalysis } from './apiScanner';

export interface LegalClauseRecommendation {
  clause: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

const BASE_CLAUSES: LegalClauseRecommendation[] = [
  { clause: 'General Terms and Conditions', reason: 'Standard for any software service.', priority: 'high' },
  { clause: 'Privacy Policy', reason: 'Mandatory for collecting any user data.', priority: 'high' },
  { clause: 'Limitation of Liability', reason: 'Standard legal protection.', priority: 'medium' },
  { clause: 'Intellectual Property Rights', reason: 'Protecting software ownership.', priority: 'medium' },
];

const SENSITIVE_ROUTE_CLAUSES: LegalClauseRecommendation[] = [
  { clause: 'Data Security Measures', reason: 'Handling sensitive API routes (e.g., auth, payment).', priority: 'high' },
  { clause: 'User Account Responsibility', reason: 'If user authentication is present.', priority: 'high' },
];

export function generateLegalClauseRecommendations(
  pkgAnalysis: AnalysisResult,
  apiAnalysis: ApiRouteAnalysis
): LegalClauseRecommendation[] {
  const recommendations: Map<string, LegalClauseRecommendation> = new Map();

  BASE_CLAUSES.forEach(rec => recommendations.set(rec.clause, rec));

  pkgAnalysis.legalClauses.forEach(pkgClause => {
    const priority = pkgAnalysis.riskLevel === 'high' ? 'high' : 'medium';
    recommendations.set(pkgClause, {
      clause: pkgClause,
      reason: `Detected dependency: ${pkgClause}`,
      priority,
    });
  });

  if (apiAnalysis.sensitiveRoutesDetected) {
    SENSITIVE_ROUTE_CLAUSES.forEach(rec => recommendations.set(rec.clause, rec));
  }

  if (pkgAnalysis.legalClauses.includes('Payment Processing') || pkgAnalysis.legalClauses.includes('Personal Data Collection') || apiAnalysis.sensitiveRoutesDetected) {
    const privacyPolicy = recommendations.get('Privacy Policy');
    if (privacyPolicy) privacyPolicy.priority = 'high';
    const dataSecurity = recommendations.get('Data Security Measures');
    if (dataSecurity) dataSecurity.priority = 'high';
  }

  return Array.from(recommendations.values()).sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}
