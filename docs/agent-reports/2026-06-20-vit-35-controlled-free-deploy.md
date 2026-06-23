# VIT-35 — Publicação Gratuita Controlada para Piloto

**Data:** 2026-06-19
**Branch:** `chore/vit-35-deploy`
**Status:** Pendente de ação manual do proprietário (configuração de env vars no Vercel)

---

## 1. Checks preliminares (master atualizado)

| Teste | Resultado |
|-------|-----------|
| `git checkout master && git pull` | ✓ Fast-forward com commits da VIT-33 |
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run build` (após limpeza de cache) | ✓ |
| `npm run validate-content:ci` | ✓ 0 erros |
| `npm test` | ✓ 47/47 |

---

## 2. Auditoria pré-deploy

### 2.1 Banco de dados

Executado `npx tsx scripts/check-db-tables.ts`:

| Item | Resultado |
|------|-----------|
| 10/10 tabelas presentes | ✓ |
| Revisão `revisao-9ano-triangulos-sistemas` status `active` | ✓ (1 linha em `revisions`) |
| Migrations 001–004 refletidas (constraint `diagram` OK) | ✓ |
| `access_codes` com registros de teste | 4 linhas (fictícias — ver seção 5) |

### 2.2 Auditoria de secrets e arquivos sensíveis

| Item | Status |
|------|--------|
| `.env.local` gitignored | ✓ (`.gitignore` linha 13) |
| `data/students.local.json` gitignored | ✓ (`.gitignore`) |
| `data/students.sample.json` no repositório | ✓ (apenas nomes fictícios, sem códigos) |
| Códigos brutos no repositório | ✓ Nenhum — apenas exemplos conceituais em docs/PLANO_MATRIZ.md e `QC-AB-1234`/`QC-ZZ-9999` como placeholder nos relatórios |
| Scripts de teste expõem códigos? | ✓ Não — `test-expired-revoked-code.ts` gera hex aleatório efêmero, nunca loga |
| `service_role_key` exposta? | ✓ Não — usada apenas em `createServiceClient()` server-side |

---

## 3. Provedor gratuito escolhido

**Vercel (plano Hobby — gratuito)**

| Critério | Atende? |
|----------|---------|
| Custo zero | ✓ Plano Hobby é permanentemente gratuito para projetos pessoais |
| HTTPS automático | ✓ Certificado TLS gerenciado, renovação automática |
| Suporte a Next.js | ✓ Nativo — Vercel criou e mantém o Next.js |
| Env vars seguras no painel | ✓ Painel web com campos mascarados, nunca expostos em logs |
| Server-side secrets isolados | ✓ Variáveis sem prefixo `NEXT_PUBLIC_` ficam apenas no servidor |
| Domínio gratuito | ✓ `<projeto>.vercel.app` com HTTPS |
| Limites relevantes para piloto | ✓ 100 GB/mês de bandwidth, serverless functions com cold start aceitável |
| Sem cartão para plano Hobby | ✓ Não requer cartão de crédito |

**Alternativas descartadas:** Netlify (suporte a Next.js App Router limitado para server components), Railway (requer cartão após trial), Render (cold start longo no tier gratuito).

---

## 4. Variáveis de ambiente para o deploy

As seguintes variáveis devem ser configuradas no painel do Vercel em **Settings > Environment Variables**. Os valores devem ser copiados do `.env.local` local — **não registrar os valores aqui**.

| Variável | Visibilidade | Origem |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública (frontend) | `.env.local` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública (frontend) | `.env.local` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` — ambas suportadas) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Privada — server-side only** | `.env.local` |
| `PROFESSOR_ACCESS_CODE` | **Privada** | `.env.local` |
| `SESSION_SECRET` | **Privada** | `.env.local` (mínimo 32 chars; gerar novo para produção com `openssl rand -base64 32`) |

**Confirmações de segurança:**
- ✓ Nenhuma variável será commitada
- ✓ Nenhum valor registrado neste relatório
- ✓ `SUPABASE_SERVICE_ROLE_KEY` nunca exposta ao frontend (sem prefixo `NEXT_PUBLIC_`)
- ✓ `SESSION_SECRET` deve ser novo/diferente do desenvolvimento local em produção

---

## 5. Dados fictícios — status e plano de limpeza

O banco contém 4 registros "Aluno Teste Visual" criados durante VIT-32 e VIT-33.

Executado `npx tsx scripts/cleanup-test-data.ts` (dry-run — **sem alteração**):

```
Alunos de teste encontrados : 4

Registros que serão removidos:
  students          : 4
  access_codes      : 4
  attempts          : 5
  mission_progress  : 4
  revision_progress : 0
```

**Script criado:** `scripts/cleanup-test-data.ts`
- Modo padrão: dry-run seguro (lista o que seria removido, não altera nada)
- Modo de execução real: requer flag `--confirm` explícita
- Critério: apenas registros com `display_name = 'Aluno Teste Visual'`
- Não imprime hashes, IDs completos, códigos brutos ou secrets

**Recomendação:** Executar a limpeza com `--confirm` **após** o proprietário confirmar que os dados fictícios não são mais necessários e **antes** de compartilhar o link com alunos reais:

```
npx tsx scripts/cleanup-test-data.ts          # dry-run: confirmar o que será removido
npx tsx scripts/cleanup-test-data.ts --confirm # limpeza real (irreversível)
```

**Esta limpeza NÃO foi executada nesta VIT** — aguarda autorização explícita do proprietário.

---

## 6. Correções técnicas realizadas

| Arquivo | Alteração | Motivo |
|---------|-----------|--------|
| `next.config.ts` | Removido `experimental.serverActions.allowedOrigins: ['localhost:3000']` | Nenhuma Server Action no projeto; a restrição bloquearia server actions em produção se adicionadas futuramente |
| `.env.example` | Adicionada `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com comentário sobre as duas variantes | A variante nova do Supabase não estava documentada |

Build confirmado após as correções: ✓

---

## 7. Passos para deploy — aguardando ação do proprietário

O deploy não foi executado automaticamente. As etapas abaixo requerem ação manual do proprietário:

### 7.1 Criar conta e projeto no Vercel

1. Acessar [vercel.com](https://vercel.com) e criar conta com GitHub
2. Importar o repositório `questao-certeira-interativo`
3. Framework preset: **Next.js** (detectado automaticamente)
4. Root Directory: `/` (raiz do repositório)

### 7.2 Configurar variáveis de ambiente

No painel Vercel > **Settings > Environment Variables**, adicionar as 5 variáveis listadas na seção 4. Marcar como **Production + Preview + Development** conforme necessidade.

**Importante:** `SESSION_SECRET` para produção deve ser um valor **novo**, diferente do local. Gerar com:
```
openssl rand -base64 32
```

### 7.3 Executar deploy

Clicar em **Deploy** no painel, ou usar CLI:
```
npx vercel --prod
```

### 7.4 Verificar HTTPS

Após deploy, confirmar que a URL `https://<projeto>.vercel.app` carrega com cadeado verde.

### 7.5 Smoke test (após deploy)

Ver seção 8.

---

## 8. Smoke test — pendente de deploy

O smoke test será executado após o proprietário completar os passos da seção 7. Itens a verificar:

| # | Teste | Esperado |
|---|-------|----------|
| 1 | `https://<url>/acessar/revisao-9ano-triangulos-sistemas` abre | 200 |
| 2 | Código inválido é recusado | 401 + mensagem de erro |
| 3 | Código válido controlado entra | 200 + sessão + redirect |
| 4 | Mapa de missões carrega com 4 missões | ✓ |
| 5 | M1 abre com todos os blocos | ✓ |
| 6 | M2/M3/M4 abrem sem erro | ✓ |
| 7 | KaTeX renderiza nas fórmulas | ✓ |
| 8 | Diagramas SVG aparecem | ✓ |
| 9 | Relatório professor (`/professor`) abre com autenticação | ✓ |
| 10 | Rotas sem sessão redirecionam (307) | ✓ |
| 11 | Teste mobile básico (viewport 390px) | ✓ |

Não registrar códigos brutos durante o smoke test.

---

## 9. Confirmações de segurança

- ✓ Nenhum secret exposto (service role key, URL completa do Supabase, anon/publishable key)
- ✓ Nenhum código bruto de aluno registrado neste relatório
- ✓ Nenhum dado real de aluno utilizado
- ✓ `.env.local` não commitado
- ✓ `data/students.local.json` não commitado
- ✓ Script de limpeza criado mas **não executado** — aguarda autorização
- ✓ Deploy não executado automaticamente — aguarda ação do proprietário
- ✓ Plano Hobby da Vercel não requer cartão de crédito

---

## 10. Próximos passos para o proprietário

Em ordem:

1. [ ] Criar conta na Vercel (vercel.com) com GitHub
2. [ ] Importar repositório e configurar env vars (5 variáveis — seção 4)
3. [ ] Gerar `SESSION_SECRET` novo para produção (`openssl rand -base64 32`)
4. [ ] Executar deploy e confirmar HTTPS
5. [ ] Executar smoke test (seção 8) com código de teste controlado
6. [ ] Decidir se executa limpeza de dados fictícios (`cleanup-test-data.ts --confirm`)
7. [ ] Gerar códigos reais para alunos (`generate-codes` com `students.local.json` real)
8. [ ] Compartilhar link apenas com alunos autorizados (não publicar)
