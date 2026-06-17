# Questão Certeira Interativo

Miniapp web educacional de revisão de Matemática por missões.  
Voltado a alunos do Ensino Fundamental com experiência de treino, feedback imediato e relatório de desempenho.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend / SSR | Next.js 15 + TypeScript |
| Estilo | Tailwind CSS |
| Banco | Supabase Postgres (plano gratuito) |
| Hospedagem | Vercel Hobby (desenvolvimento) / Netlify Free (oferta controlada) |
| Autenticação | Código individual + cookie de sessão (sem login completo) |
| IA no app | **Nenhuma** — IA usada apenas para gerar e revisar conteúdo |

---

## Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar tipos
npm run type-check

# Lint
npm run lint

# Validar conteúdo JSON antes de importar
npm run validate-content content/revisions/revisao-9ano-triangulos-sistemas.json

# Importar conteúdo para o Supabase
npm run import-revision content/revisions/revisao-9ano-triangulos-sistemas.json

# Gerar códigos de acesso para alunos
npm run generate-codes
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=       # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Chave anônima (pode ir no frontend)
SUPABASE_SERVICE_ROLE_KEY=      # Chave de serviço (NUNCA no frontend)
PROFESSOR_ACCESS_CODE=          # Senha de acesso ao painel do professor
SESSION_SECRET=                 # Segredo para cookies
```

---

## Estrutura de pastas

```
src/
├── app/                    # Rotas Next.js (App Router)
│   ├── page.tsx            # Página inicial
│   ├── acessar/[slug]/     # Acesso por código
│   ├── revisao/[slug]/     # Mapa de missões, missão, simulado, relatório
│   ├── professor/          # Painel do professor
│   └── api/                # Route Handlers
├── components/             # Componentes reutilizáveis
├── lib/                    # Supabase, sessão, scoring, validação
└── types/                  # Tipos TypeScript

content/revisions/          # Conteúdo pedagógico em JSON
scripts/                    # import, validate, generate-codes
supabase/migrations/        # SQL de criação do banco
```

---

## Fluxo básico

```
aluno recebe código individual
→ /acessar/[slug] — digita o código
→ /revisao/[slug] — mapa de missões
→ /revisao/[slug]/missao/[slug] — missão didática (blocos + questões)
→ feedback por questão → resultado da missão
→ /revisao/[slug]/simulado — simulado final opcional
→ /revisao/[slug]/relatorio — relatório individual
```

---

## Custo zero

Este projeto foi construído para não gerar custos durante desenvolvimento e teste controlado.

- Supabase Free: 500 MB de banco, 2 projetos, 50.000 MAU
- Vercel Hobby: builds e deploys gratuitos para projetos pessoais
- Nenhuma API paga é chamada pelo app em produção

Leia `COST_GUARDRAILS.md` antes de adicionar qualquer dependência.

---

## Privacidade

O app coleta apenas: apelido/nome, série, código de acesso, respostas e progresso.  
**Não coleta** CPF, e-mail, telefone, localização nem dados de saúde.  
Público-alvo inclui menores de idade — coleta é mínima por design.  
Leia `PRIVACY_NOTES.md`.
