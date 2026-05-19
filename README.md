# ⚖️ AutoLegal MicroSaaS

Gerador automatizado de documentos legais para micro-SaaS, utilizando análise de tech stack e **Inteligência Artificial**.

> Projeto criado autonomamente pelo **Antigravity Kit**.

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **AI:** Geração de documentos via LLM
- **Containerização:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## 📋 Sobre o Projeto
O AutoLegal analisa a stack tecnológica de um projeto micro-SaaS e gera automaticamente documentos legais (Termos de Uso, Política de Privacidade, etc.) personalizados para o contexto do negócio.

## 🚀 Como Rodar

### Desenvolvimento
```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Com Docker
```bash
docker-compose up -d
```

## 📁 Estrutura
```
autolegal-microsaas/
├── src/                    # Código fonte
├── public/                 # Assets estáticos
├── .github/workflows/      # CI/CD pipelines
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🔗 Projetos Relacionados
- [Antigravity Kit](https://github.com/marcuslinhares/antigravity-kit) — Framework que gerou este projeto

## 📝 Licença
MIT
