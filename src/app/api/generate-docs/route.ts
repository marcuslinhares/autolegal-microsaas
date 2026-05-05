import { NextRequest, NextResponse } from 'next/server';
import { analyzePackageJson } from '@/services/analyzer';
import { generateLegalClauseRecommendations } from '@/services/legalClauseGenerator';
import { generateLegalDocumentContent } from '@/services/aiGenerator';

const isDev = process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageJson } = body;

    if (!packageJson || typeof packageJson !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "packageJson" field in request body.' },
        { status: 400 }
      );
    }

    // Step 1: Analyze the package.json
    const analysis = analyzePackageJson(packageJson);

    // Step 2: Scan API routes (currently the project root)
    // In a real server environment, we'd use process.cwd() or a provided path.
    // Here we import dynamically to avoid filesystem issues at build time.
    let apiAnalysis = { routes: [] as { path: string; methods: string[] }[], sensitiveRoutesDetected: false };

    try {
      const { analyzeApiRoutes } = await import('@/services/apiScanner');
      const projectRoot = process.cwd();
      apiAnalysis = await analyzeApiRoutes(projectRoot);
    } catch {
      // scanner error is non-fatal - proceed with empty route analysis
    }

    // Step 3: Generate legal recommendations
    const recommendations = generateLegalClauseRecommendations(analysis, apiAnalysis);

    // Step 4: Build document titles
    const documentTitle = analysis.riskLevel === 'high'
      ? 'Comprehensive Legal Package'
      : 'Standard Legal Documents';

    // Step 5: Generate content
    const document = await generateLegalDocumentContent(
      documentTitle,
      recommendations,
      `Dependencies analyzed: ${analysis.dependencies.length} found. Risk level: ${analysis.riskLevel}.`
    );

    return NextResponse.json({
      content: document.content,
      metadata: {
        title: document.title,
        riskLevel: analysis.riskLevel,
        aiModelUsed: document.aiModelUsed,
        timestamp: document.timestamp,
        dependencies: analysis.dependencies,
        legalClauses: analysis.legalClauses,
        recommendations: recommendations,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    // In production, return a generic message to avoid leaking internal details.
    const sanitized = isDev ? message : 'An internal error occurred while generating documents.';
    return NextResponse.json({ error: sanitized }, { status: 500 });
  }
}
