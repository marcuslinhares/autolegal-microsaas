import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { LegalClauseRecommendation } from './legalClauseGenerator';

const mockRecommendations: LegalClauseRecommendation[] = [
  {
    clause: 'General Terms and Conditions',
    reason: 'Standard for any software service.',
    priority: 'high',
  },
  {
    clause: 'Privacy Policy',
    reason: 'Mandatory for collecting any user data.',
    priority: 'high',
  },
];

/**
 * Helper to set up a Groq mock using vi.doMock (non-hoisted).
 * Must be called before the dynamic import in the same test.
 */
function setupGroqMock(createImpl: () => Promise<any>) {
  const mockCreate = vi.fn().mockImplementation(createImpl);

  vi.doMock('groq-sdk', () => {
    return {
      default: class MockGroq {
        chat = {
          completions: {
            create: mockCreate,
          },
        };
      },
    };
  });

  return mockCreate;
}

describe('aiGenerator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should generate a document with Groq API when API key is provided', async () => {
    setupGroqMock(() =>
      Promise.resolve({
        choices: [
          {
            message: {
              content:
                '# Termos de Uso\n\n## Preâmbulo\n\nEste documento rege o uso do software.',
            },
          },
        ],
      })
    );

    process.env.AI_API_KEY = 'gsk_test_key';
    process.env.AI_MODEL = 'llama3-8b-8192';

    const { generateLegalDocumentContent } = await import('./aiGenerator');

    const result = await generateLegalDocumentContent(
      'Comprehensive Legal Package',
      mockRecommendations,
      'Dependencies analyzed: 5 found. Risk level: high.',
      'TestProject'
    );

    expect(result.title).toBe('Comprehensive Legal Package');
    expect(result.content).toContain('Termos de Uso');
    expect(result.aiModelUsed).toContain('Groq');
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('should use default model when AI_MODEL is not set', async () => {
    setupGroqMock(() =>
      Promise.resolve({
        choices: [
          {
            message: {
              content: '# Test Document\n\nGenerated content.',
            },
          },
        ],
      })
    );

    process.env.AI_API_KEY = 'gsk_test_key';
    delete process.env.AI_MODEL;

    const { generateLegalDocumentContent } = await import('./aiGenerator');

    const result = await generateLegalDocumentContent(
      'Test Document',
      mockRecommendations
    );

    expect(result.aiModelUsed).toContain('llama3-70b-8192');
  });

  it('should fall back to offline generation when no API key is provided', async () => {
    delete process.env.AI_API_KEY;

    const { generateLegalDocumentContent } = await import('./aiGenerator');

    const result = await generateLegalDocumentContent(
      'Standard Legal Documents',
      mockRecommendations
    );

    expect(result.title).toBe('Standard Legal Documents');
    expect(result.content).toContain('## Preâmbulo');
    expect(result.content).toContain('General Terms and Conditions');
    expect(result.aiModelUsed).toBe('Fallback (offline)');
    expect(result.timestamp).toBeDefined();
  });

  it('should fall back on API error', async () => {
    setupGroqMock(() => Promise.reject(new Error('API rate limit exceeded')));

    process.env.AI_API_KEY = 'gsk_test_key';

    const { generateLegalDocumentContent } = await import('./aiGenerator');

    const result = await generateLegalDocumentContent(
      'Standard Legal Documents',
      mockRecommendations
    );

    expect(result.content).toContain('## Preâmbulo');
    expect(result.aiModelUsed).toContain('Fallback');
    expect(result.aiModelUsed).toContain('API rate limit exceeded');
  });

  it('should handle empty recommendations gracefully', async () => {
    delete process.env.AI_API_KEY;

    const { generateLegalDocumentContent } = await import('./aiGenerator');

    const result = await generateLegalDocumentContent(
      'Empty Document',
      [],
      '',
      'EmptyProject'
    );

    expect(result.title).toBe('Empty Document');
    expect(result.content).toContain('EmptyProject');
    expect(result.aiModelUsed).toBe('Fallback (offline)');
  });
});
