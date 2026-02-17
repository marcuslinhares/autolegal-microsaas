import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface ApiRouteAnalysis {
  routes: { path: string; methods: string[] }[];
  sensitiveRoutesDetected: boolean;
}

const SENSITIVE_KEYWORDS = ['auth', 'user', 'admin', 'payment', 'webhook', 'login', 'register'];

export async function analyzeApiRoutes(projectRoot: string): Promise<ApiRouteAnalysis> {
  const apiRoutes: { path: string; methods: string[] }[] = [];
  let sensitiveRoutesDetected = false;

  const files = await glob('src/app/api/**/*.ts', { cwd: projectRoot, absolute: true });

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const methods: string[] = [];

    const methodRegex = /export async function (GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
    let match;
    while ((match = methodRegex.exec(content)) !== null) {
      methods.push(match[1]);
    }

    if (methods.length > 0) {
      const routePath = file
        .replace(join(projectRoot, 'src/app'), '')
        .replace('/api/', '/api/')
        .replace('/route.ts', '')
        .replace(/\[(\w+)\]/g, ':$1');

      apiRoutes.push({ path: routePath, methods });

      if (SENSITIVE_KEYWORDS.some(keyword => routePath.includes(keyword))) {
        sensitiveRoutesDetected = true;
      }
    }
  }

  return {
    routes: apiRoutes,
    sensitiveRoutesDetected,
  };
}
