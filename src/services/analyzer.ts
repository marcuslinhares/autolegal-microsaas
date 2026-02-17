export interface AnalysisResult {
  dependencies: string[];
  legalClauses: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const DEPENDENCY_MAP: Record<string, string[]> = {
  'stripe': ['Payment Processing', 'Financial Data Storage', 'Third-party Payment Processor'],
  'prisma': ['Database Usage', 'Data Persistence'],
  'next-auth': ['User Authentication', 'Personal Data Collection', 'Session Management'],
  'mongodb': ['NoSQL Data Storage', 'Cloud Database'],
  'firebase': ['Cloud Services', 'Real-time Data', 'Authentication'],
  'posthog': ['Analytics', 'User Behavior Tracking'],
  'sentry': ['Error Tracking', 'Log Collection'],
  'resend': ['Email Communications', 'Third-party Mail Service'],
  'aws-sdk': ['Cloud Infrastructure', 'Third-party Hosting'],
};

export function analyzePackageJson(content: string): AnalysisResult {
  try {
    const pkg = JSON.parse(content);
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    const detectedDeps = Object.keys(allDeps);
    const legalClauses = new Set<string>();

    detectedDeps.forEach(dep => {
      if (DEPENDENCY_MAP[dep]) {
        DEPENDENCY_MAP[dep].forEach(clause => legalClauses.add(clause));
      }
    });

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (legalClauses.has('Payment Processing') || legalClauses.has('Personal Data Collection')) {
      riskLevel = 'high';
    } else if (legalClauses.size > 3) {
      riskLevel = 'medium';
    }

    return {
      dependencies: detectedDeps,
      legalClauses: Array.from(legalClauses),
      riskLevel,
    };
  } catch (error) {
    throw new Error('Invalid package.json content');
  }
}
