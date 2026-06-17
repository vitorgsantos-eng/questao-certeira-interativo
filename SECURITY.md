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
- Cookie `qci_session` (httpOnly, sameSite: lax) armazena sessão codificada em base64
- A sessão contém: studentId, revisionId, revisionSlug, displayName, grade, expiresAt
- Toda rota de conteúdo valida a sessão antes de retornar dados
- Códigos de acesso são salvos **apenas como hash bcrypt** no banco

## Conteúdo protegido

Questões, opções e feedbacks só são retornados após validação de sessão.

O conteúdo não é servido de `/public` — é servido via API com verificação.

## Row Level Security (RLS) no Supabase

RLS está habilitado em todas as tabelas.

- `service_role`: acesso total (usado pelo backend)
- `anon`: leitura de revisões ativas, missões e blocos de conteúdo para SSR
- Escrita em `attempts` e `mission_progress`: apenas via API com service_role

## Sessão do professor

- Cookie `qci_professor` separado, válido por 8 horas
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

- A sessão em base64 não é assinada criptograficamente. Para produção com mais usuários, considerar assinar com SESSION_SECRET usando HMAC ou migrar para JWT.
- Rate limiting nas rotas de validação de código não está implementado. Para produção, adicionar limite de tentativas por IP.
