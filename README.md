# ⚖️ AutoLegal MicroSaaS

> Gerador automatizado de documentos legais para micro-SaaS. Analisa a stack tecnológica do projeto e gera contratos personalizados (Termos de Uso, Política de Privacidade) usando IA via API Groq.

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Groq](https://img.shields.io/badge/Groq-LLM-FF4400?logo=groq)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)

> Projeto criado autonomamente pelo **Antigravity Kit**.

---

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Como Funciona](#-como-funciona)
- [Tech Stack](#-tech-stack)
- [Como Rodar](#-como-rodar)
- [API](#-api)
- [Estrutura](#-estrutura)
- [CI/CD](#-cicd)

---

## 🎯 Sobre

O **AutoLegal** resolve um problema real de founders de micro-SaaS: a necessidade de documentação legal personalizada sem gastar fortunas com advogados. A ferramenta:

1. Analisa a **stack tecnológica** do seu projeto (Next.js, Supabase, Stripe, etc.)
2. Identifica **dados coletados**, **serviços de terceiros** e **jurisdições aplicáveis**
3. Gera documentos legais prontos para publicação via **LLM (Groq API)**

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📄 **Termos de Uso** | Documento personalizado com base no tipo de SaaS |
| 🔒 **Política de Privacidade** | LGPD-ready, identifica dados coletados e armazenados |
| 🤖 **Análise de Stack** | Detecta automaticamente serviços e dependências do projeto |
| 💾 **Fallback Offline** | Templates pré-definidos quando não há API key disponível |
| 🐳 **Containerizado** | Docker + Docker Compose prontos para deploy |

---

## 🔧 Como Funciona

1. **Usuário descreve o projeto** — nome, stack, tipo de dados coletados
2. **Análise automática** — o sistema identifica implicações legais da stack
3. **Geração via LLM** — chama Groq API com prompt estruturado
4. **Revisão e download** — documentos gerados em markdown, prontos para edição

### Exemplo de Análise

| Stack Detectada | Implicação Legal |
|---|---|
| Next.js + Vercel | Hospedagem nos EUA → Cláusula de transferência internacional |
| Supabase | Banco de dados → Política de retenção de dados |
| Stripe | Pagamentos → LGPD + PCI compliance |
| Auth.js (NextAuth) | Autenticação → Cookies e consentimento |

---

## 🛠️ Tech Stack

| Categoria | Tecnologias |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| **AI** | Groq API (LLaMA 3) para geração de documentos |
| **Container** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 🚀 Como Rodar

### Desenvolvimento

```bash
git clone https://github.com/marcuslinhares/autolegal-microsaas.git
cd autolegal-microsaas
npm install

# Configure a API Key (opcional — fallback offline incluso)
echo "GROQ_API_KEY=sua_chave_aqui" > .env.local

npm run dev
# Acesse http://localhost:3000
```

### Docker

```bash
docker-compose up -d
```

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GROQ_API_KEY` | ❌ (fallback offline) | Chave da API Groq para geração via LLM |

---

## 🔌 API

| Rota | Método | Descrição |
|---|---|---|
| `/api/generate` | POST | Gera documentos legais para um projeto |
| `/api/generate` | GET | Lista templates disponíveis |

### Exemplo: `POST /api/generate`

```json
{
  "projectName": "MeuApp",
  "projectType": "E-commerce",
  "stack": ["Next.js", "Supabase", "Stripe", "Auth.js"],
  "collectsUserData": true,
  "jurisdiction": "BR"
}
```

Resposta:

```json
{
  "documents": {
    "terms": "## Termos de Uso\n\n...",
    "privacy": "## Política de Privacidade\n\n..."
  },
  "generatedAt": "2026-06-01T12:00:00Z"
}
```

---

## 📁 Estrutura

```
autolegal-microsaas/
├── src/
│   ├── app/
│   │   ├── api/generate/   # API route de geração
│   │   ├── page.tsx        # Página principal
│   │   └── layout.tsx      # Layout global
│   ├── components/         # Componentes UI
│   ├── lib/
│   │   ├── llm.ts          # Integração com Groq API
│   │   └── templates.ts    # Fallback offline templates
│   └── types/              # TypeScript types
├── public/                 # Assets estáticos
├── .github/workflows/      # CI/CD
├── Dockerfile
├── docker-compose.yml
└── next.config.ts
```

---

## 🔄 CI/CD

Pipeline GitHub Actions:

- ✅ **Lint** — ESLint + Prettier
- ✅ **Build** — Next.js build check
- ✅ **Docker** — Multi-stage build validation

---

## 🔗 Projetos Relacionados

- [Antigravity Kit](https://github.com/marcuslinhares/antigravity-kit) — Framework que gerou este projeto autonomamente

---

## 📄 Licença

MIT © Marcus Linhares
