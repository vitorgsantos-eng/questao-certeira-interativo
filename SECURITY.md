# SECURITY.md — Questão Certeira Interativo

## Variáveis de ambiente

| Variável | Onde usar | Observação |
|----------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + backend | Pode ser pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend + backend | Pode ser pública — protegida por RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **Apenas backend** | **NUNCA expor no frontend** |
| `PROFESSOR_ACCESS_CODE` | **Apenas backend** | Senha do painel do professor |
| `SESSION_SECRET` | **Apenas backend** | Segredo dos cookies |

## Proteção da chave de serviço

A `SUPABASE_SERVICE_ROLE_KEY` dá acesso irrestrito ao banco, ignorando RLS.

Regras:
- Nunca usar em componentes com `'use client'`
- Nunca usar em variáveis com prefixo `NEXT_PUBLIC_`
- Usar apenas em Route Handlers e Server Actions
- Usar `createServiceClient()` (src/lib/supabase/server.ts) apenas no servidor

## Controle de acesso

O app usa um sistema de "auth-lite":
- Cookie `qci_session` (httpOnly, sameSite: lax) armazena sessão assinada com HMAC-SHA256
- A sessão contém: studentId, revisionId, revisionSlug, displayName, grade, expiresAt
- Cookie adulterado ou com assinatura inválida é rejeitado automaticamente
- Toda rota de conteúdo valida a sessão antes de retornar dados
- Códigos de acesso são salvos **apenas como hash bcrypt** no banco

## Conteúdo protegido

Questões, opções e feedbacks só são retornados após validação de sessão.

O conteúdo não é servido de `/public` — é servido via API com verificação.

## Row Level Security (RLS) no Supabase

RLS está habilitado em todas as tabelas.

- `service_role`: acesso total (usado pelo backend)
- `anon`: leitura restrita — apenas `revisions` (status=active), `missions` e `content_blocks`
- `questions`, `question_options`: protegidos (sem acesso anon) — contêm respostas corretas, feedback e categorias de erro
- `students`, `access_codes`, `attempts`, `mission_progress`, `revision_progress`: sem acesso anon
- Escrita em `attempts` e `mission_progress`: apenas via API com service_role
- Páginas com conteúdo sensível usam `createServiceClient()` após verificação de sessão

## Sessão do professor

- Cookie `qci_professor` separado, válido por 8 horas, assinado com HMAC-SHA256
- Payload JSON: `{ role, issuedAt, expiresAt }` em base64 + assinatura
- Cookie adulterado, expirado ou sem assinatura é rejeitado
- Código validado via `PROFESSOR_ACCESS_CODE` no servidor
- Sem JWT, sem OAuth — simples e sem dependência paga

## OWASP mínimo (inspirado em ASVS)

- [ ] Inputs validados com Zod antes de qualquer operação
- [ ] Nenhum dado sensível em logs
- [ ] Nenhuma query com interpolação direta de string (usar Supabase client)
- [ ] Cookies com httpOnly e sameSite
- [ ] HTTPS em produção
- [ ] Sem SQL injection possível via ORM do Supabase

## Dívidas técnicas de segurança

- Rate limiting é baseado em memória (in-process Map). Em ambientes com múltiplas instâncias, considerar Redis ou solução persistente. Para MVP com instância única, é suficiente.
