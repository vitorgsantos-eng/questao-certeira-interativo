# VIT-33 — Validação E2E dos Fluxos Principais

**Data:** 2026-06-19 (executado em 22h, horário de Brasília)
**Branch:** `wip/agente-seguranca-supabase`
**Servidor testado:** `http://localhost:3010` (cache `.next/` limpo antes do início)

---

## 1. Ambiente

| Item | Resultado |
|------|-----------|
| Cache `.next/` limpo antes do teste | ✓ |
| Servidor iniciado na porta 3010 | ✓ `Ready in 9.6s` |
| `.env.local` carregado automaticamente pelo Next.js | ✓ |
| Revisão `revisao-9ano-triangulos-sistemas` no banco | ✓ (importada na VIT-32) |
| 1 código controlado gerado para aluno fictício | ✓ (gerado na VIT-32) |

---

## 2. ETAPA 1 — Checks preliminares (antes dos testes E2E)

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run build` | ✓ |
| `npm run validate-content:ci` | ✓ 0 erros |
| `npm test` | ✓ 47/47 |

---

## 3. ETAPA 2 — Fluxo de acesso por código

### 3.1 Página de acesso

URL testada: `/acessar/revisao-9ano-triangulos-sistemas`

| Elemento | Resultado |
|----------|-----------|
| Badge "9º ano" | ✓ |
| Título "Revisão Interativa — Triângulos e Sistemas" | ✓ |
| Campo de código com placeholder `QC-AB-1234` | ✓ |
| Botão "Entrar na revisão" desabilitado se campo vazio | ✓ |
| Hint "Formato: QC-XX-XXXX" | ✓ |

### 3.2 Código inválido

Código testado: `QC-ZZ-9999`

| Verificação | Resultado |
|-------------|-----------|
| API retornou 401 | ✓ (log do servidor) |
| Mensagem de erro exibida: "Código inválido. Verifique e tente novamente." | ✓ (vermelho, abaixo do campo) |
| URL não alterada | ✓ (permanece em `/acessar/...`) |
| Sessão não criada | ✓ |
| Botão voltou ao estado ativo | ✓ |

### 3.3 Código válido

Código controlado gerado na VIT-32 (aluno fictício — não registrado neste documento):

| Verificação | Resultado |
|-------------|-----------|
| Estado "Verificando..." durante requisição | ✓ |
| API retornou 200 | ✓ (log do servidor) |
| Redirect para `/revisao/revisao-9ano-triangulos-sistemas` | ✓ |
| Sessão criada (cookie) | ✓ |
| Header com "Aluno Teste Visual / 9º ano" | ✓ |

### 3.4 Código expirado/revogado

Não testado — não há código expirado ou revogado disponível no ambiente de teste. Comportamento de rejeição (401) foi verificado com código inexistente; a lógica de expiração/revogação está coberta pelos testes unitários em `npm test`.

---

## 4. ETAPA 3 — Mapa de missões

URL: `/revisao/revisao-9ano-triangulos-sistemas`

| Elemento | Resultado |
|----------|-----------|
| Nome do aluno no header | ✓ "Aluno Teste Visual / 9º ano" |
| Progresso geral inicial: 0% / 0 de 4 missões | ✓ |
| Diagnóstico rápido com botões "Começar diagnóstico" e "Pular" | ✓ |
| 4 missões listadas com status "Não iniciada" | ✓ |
| M1: Semelhança de Triângulos | ✓ |
| M2: Relações Métricas no Triângulo Retângulo | ✓ |
| M3: Trigonometria no Triângulo Retângulo | ✓ |
| M4: Sistemas com Equações do 2º Grau | ✓ |
| "Simulado final" com botão "Ir ao simulado" | ✓ |

---

## 5. ETAPA 4 — Fluxo completo da Missão 1 (Semelhança de Triângulos)

URL: `/revisao/revisao-9ano-triangulos-sistemas/missao/semelhanca-triangulos`

### 5.1 Blocos de conteúdo

| Bloco | Tipo | Resultado |
|-------|------|-----------|
| "Nesta missão, você vai aprender..." | `intro` | ✓ |
| "IDEIA ANTES DA FÓRMULA" com highlight | `concept` | ✓ |
| SimilarTrianglesDiagram (k=1,5, triângulos azul/verde) | `diagram` | ✓ |
| Legenda com "Triângulo menor" e "Triângulo maior (k = 1,5)" | `diagram` | ✓ |
| Badge "k = 1,5" no diagrama | `diagram` | ✓ |
| "Como reconhecer triângulos semelhantes" (AA/LAL/LLL) | `visual_explanation` | ✓ |
| Exemplos resolvidos com passos numerados | `worked_example` (×2) | ✓ |
| KaTeX nos passos: `6 ÷ 3 = 2, 8 ÷ 4 = 2` | KaTeX inline | ✓ |

### 5.2 Questões (5/5 respondidas)

| Q | Tipo | Dificuldade | Resposta | Resultado |
|---|------|-------------|----------|-----------|
| 1 | múltipla escolha | basic | A (correta) | ✓ verde, KaTeX no feedback |
| 2 | múltipla escolha | basic | B (errada — intencional) | ✓ vermelho, categoria "identificação de elementos" |
| 3 | numérica | intermediate | 54 (correta) | ✓ KaTeX no feedback |
| 4 | múltipla escolha | intermediate | A (correta) | ✓ KaTeX com frações no feedback |
| 5 | múltipla escolha | challenge | A (correta) | ✓ KaTeX com frações empilhadas |

### 5.3 KaTeX verificado em

- Enunciados com símbolos matemáticos (°, ÷, =)
- Passos dos exemplos resolvidos (`6 ÷ 3 = 2`)
- Feedbacks de resposta correta (`6 ÷ 2 = 3, 12 ÷ 4 = 3, 18 ÷ 6 = 3`)
- Feedbacks com frações: `AB/DE = BC/EF ⇒ 6/9 = 8/x ⇒ x = 12`
- Frações empilhadas: `Árvore/sombra = Poste/sombra ⇒ h/8 = 3/4 ⇒ h = 6m`

### 5.4 Tela de resultado

| Elemento | Resultado |
|----------|-----------|
| "MISSÃO CONCLUÍDA" | ✓ |
| Score: 80% (4 de 5 corretas) | ✓ |
| Barra de progresso verde | ✓ |
| "Pontos a revisar" — badge "identificação de elementos" | ✓ |
| "Revisão dos erros" com Q2 (enunciado + explicação + resposta correta) | ✓ |
| Botões "Refazer missão" e "Voltar ao mapa de missões" | ✓ |

---

## 6. ETAPA 5 — Progresso persistido (Supabase)

Após conclusão da M1:

| Verificação | Resultado |
|-------------|-----------|
| Progresso geral no mapa: 0% → 25% | ✓ |
| "1 de 4 missões obrigatórias concluídas" | ✓ |
| M1 badge "Concluída" com checkmark verde | ✓ |
| M1 score: 80% com barra verde | ✓ |
| M2–M4 ainda "Não iniciada" | ✓ |

---

## 7. ETAPA 6 — Quick visual check M2 (RightTriangleMetricsDiagram)

URL: `/revisao/.../missao/relacoes-metricas-triangulo-retangulo`

| Elemento | Resultado |
|----------|-----------|
| Missão carregou sem erros | ✓ |
| RightTriangleMetricsDiagram visível | ✓ |
| Ângulo reto em A (marcador quadrado no ápice) | ✓ |
| Altitude h pontilhada do ápice à base | ✓ |
| Catetos a/b coloridos (vermelho/verde) | ✓ |
| Projeções m/n na base | ✓ |
| Marcador de ângulo reto no pé da altitude | ✓ |
| Legenda com 6 itens coloridos | ✓ |
| Caption pedagógico | ✓ |

M3 e M4 não visitadas visualmente — fora do escopo desta VIT (missões de conteúdo semelhante).

---

## 8. ETAPA 7 — Proteção de rotas (sem sessão)

Testado via `curl` sem cookie de sessão:

| Rota | Esperado | Resultado |
|------|----------|-----------|
| `GET /revisao/revisao-9ano-triangulos-sistemas` | 307 → `/acessar/...` | ✓ |
| `GET /revisao/.../missao/semelhanca-triangulos` | 307 → `/acessar/...` | ✓ |
| `GET /acessar/...` (pública) | 200 | ✓ |
| `GET /professor` (pública, exige senha interna) | 200 | ✓ |

---

## 9. ETAPA 8 — Relatório do professor

URL: `/professor` (autenticado com `PROFESSOR_ACCESS_CODE`)

| Elemento | Resultado |
|----------|-----------|
| Tela de login com campo de código (mascarado) | ✓ |
| Autenticação com PROFESSOR_ACCESS_CODE | ✓ |
| Painel com header "Painel do professor" e link "Sair" | ✓ |
| Stats: 4 Estudantes, 4 Códigos ativos, 4 Missões concluídas | ✓ |
| Revisão "Revisão Interativa — Triângulos e Sistemas" status "active" | ✓ |
| "Alunos e progresso" com 4 registros "Aluno Teste Visual" | ✓ |
| Aluno desta sessão: 1 missão, 80%, última atividade 19/06/2026 | ✓ |
| Expiração "04/07/2026" nos cartões | ✓ |
| Barras de progresso por aluno | ✓ |

Observação: 4 registros "Aluno Teste Visual" no banco são resultado das múltiplas execuções de `generate-codes` durante as sessões de teste (VIT-32 + VIT-33). Todos são fictícios e gitignored.

---

## 10. Confirmações de segurança

- ✓ Código bruto do aluno não registrado neste relatório, PR, chat ou GitHub
- ✓ `PROFESSOR_ACCESS_CODE` não registrado neste relatório
- ✓ Nenhum secret exposto (service role key, URL completa, anon key)
- ✓ `.env.local` não commitado
- ✓ `data/students.local.json` não commitado
- ✓ Nenhum dado real de aluno utilizado
- ✓ Sem deploy
- ✓ Sem serviço pago adicionado

---

## 11. Problemas encontrados e resolvidos

| Problema | Solução |
|---------|---------|
| Cache `.next/` obsoleto (`vendor-chunks/tailwind-merge.js` not found) nos servidores da sessão anterior | Deletado `.next/`, servidor reiniciado na porta 3010 |
| Screenshots em branco no Chrome MCP (tab em background) | Problema de renderização — resolvido ao verificar estado via `read_console_messages` e `logs do servidor` |
| Bug no script de teste (código expirado retornando 401 em vez de 403) | `verifyCode()` aplica `.toUpperCase()` antes do `bcrypt.compare`; script gerava hex lowercase — hash não batia. Corrigido com `.toUpperCase()` no script |

---

## 13. Teste de código expirado e revogado (complementação)

**Método:** Script TypeScript isolado `scripts/test-expired-revoked-code.ts` que:
1. Gera dois códigos brutos fictícios descartáveis (hex aleatório, nunca logado)
2. Insere dois registros temporários em `access_codes` via service client:
   - **Expirado:** `status = 'active'`, `expires_at = ontem`
   - **Revogado:** `status = 'revoked'`, `expires_at = próximo ano`
3. Chama `POST http://localhost:3010/api/auth/validate-code` para cada código
4. Verifica resposta HTTP e mensagem de erro
5. Deleta os dois registros ao final (confirmado: "2 registro(s) temporário(s) removido(s) do banco")

| Teste | Esperado | Resultado |
|-------|----------|-----------|
| Código expirado → HTTP status | 403 | ✓ 403 |
| Código expirado → mensagem | contém "expirou" | ✓ "Este código expirou. Solicite um novo ao professor." |
| Código expirado → sessão criada? | não | ✓ ok !== true |
| Código revogado → HTTP status | 401 | ✓ 401 |
| Código revogado → mensagem | contém "inválido" | ✓ "Código inválido. Verifique e tente novamente." |
| Código revogado → sessão criada? | não | ✓ ok !== true |
| Status HTTP expirado ≠ revogado | diferentes | ✓ 403 ≠ 401 |
| Mensagens expirado ≠ revogado | diferentes | ✓ mensagens distintas |

**Resultado: 8/8 PASS.** Comportamentos diferenciados confirmados: código expirado retorna 403 com mensagem pedagógica; código revogado é filtrado antes do bcrypt e retorna 401 genérico.

**Segurança:** nenhum código bruto registrado. Registros temporários removidos do banco. Nenhum aluno real utilizado.

---

## 14. Quick visual check M3 — Trigonometria no Triângulo Retângulo

URL: `/revisao/.../missao/trigonometria-triangulo-retangulo`

| Elemento | Resultado |
|----------|-----------|
| Página carrega sem 500/404 | ✓ |
| Sessão ativa no header | ✓ "Aluno Teste Visual / 9º ano" |
| Bloco `concept` com conceito central da trigonometria | ✓ |
| KaTeX — três fórmulas como frações | ✓ `sen α = cateto oposto / hipotenusa`, `cos α = cateto adjacente / hipotenusa`, `tg α = cateto oposto / cateto adjacente` |
| TrigonometryDiagram SVG | ✓ |
| Triângulo com hipotenusa (diagonal azul) | ✓ |
| Cateto oposto (lado direito, vermelho) | ✓ |
| Cateto adjacente (base, laranja) | ✓ |
| Ângulo α no canto inferior esquerdo | ✓ |
| Marcador de ângulo reto em C | ✓ (quadrado no canto inferior direito) |
| Badges seno/cosseno/tangente no diagrama | ✓ |
| Caption pedagógico | ✓ "Oposto e adjacente mudam conforme o ângulo escolhido" |
| Bloco "Como identificar oposto e adjacente" | ✓ |
| Botão "Iniciar questões (5 questões)" | ✓ |

---

## 15. Quick visual check M4 — Sistemas com Equações do 2º Grau

URL: `/revisao/.../missao/sistemas-equacoes-2-grau`

| Elemento | Resultado |
|----------|-----------|
| Página carrega sem 500/404 | ✓ |
| Sessão ativa no header | ✓ |
| Bloco `intro` com conceito do sistema | ✓ |
| Bloco `concept` — estratégia de substituição | ✓ "Isole na equação mais simples → Substitua na mais complexa → Resolva" |
| SystemsStrategyCard | ✓ |
| Fluxo Isole → Substitua → Simplifique → Verifique | ✓ (ícones ①②③④, setas, descrição em cada passo) |
| Bloco "ATALHO — SOMA E PRODUTO CONHECIDOS" | ✓ |
| Fórmula `x + y = S`, `x · y = P` → `t² – St + P = 0` | ✓ |
| Caption "x e y são as raízes dessa equação" | ✓ |
| KaTeX no "EXEMPLO RESOLVIDO" | ✓ sistema `{ x + y = 5 | x² + y² = 13 }`, passos com expoentes e identidade `(a-b)² = a² - 2ab + b²` |
| Botão "Iniciar questões (5 questões)" | ✓ |

---

## 16. Checks finais (complementação)

| Teste | Resultado |
|-------|-----------|
| `npm run lint` | ✓ (1 warning pré-existente em `server.ts`) |
| `npm run type-check` | ✓ |
| `npm run validate-content:ci` | ✓ 0 erros |
| `npm test` | ✓ 47/47 (14 validation + 20 session + 13 rate-limiting) |

`npm run build` não foi reexecutado nesta complementação — estava passando antes do início da VIT-33 e não houve alteração de código de produção.

---

## 17. Resultado geral

| Fluxo | Status |
|-------|--------|
| Acesso com código inválido | ✓ PASS |
| Acesso com código válido + sessão + redirect | ✓ PASS |
| Código expirado → 403 + mensagem pedagógica | ✓ PASS |
| Código revogado → 401 + mensagem genérica | ✓ PASS |
| Mapa de revisão | ✓ PASS |
| Conteúdo da missão M1 (todos os tipos de bloco) | ✓ PASS |
| Diagramas SVG — SimilarTriangles (M1) | ✓ PASS |
| Diagramas SVG — RightTriangleMetrics (M2) | ✓ PASS |
| Diagramas SVG — Trigonometry (M3) | ✓ PASS |
| Sistemas M4 — SystemsStrategyCard + soma/produto | ✓ PASS |
| KaTeX em enunciados, exemplos, feedbacks, diagramas | ✓ PASS |
| Questões múltipla escolha (feedback correto/errado) | ✓ PASS |
| Questões numéricas | ✓ PASS |
| Tela de resultado com categoria de erro | ✓ PASS |
| Progresso persistido no Supabase | ✓ PASS |
| Proteção de rotas (redirect 307 sem sessão) | ✓ PASS |
| Relatório do professor (dados reais, progresso) | ✓ PASS |

**Conclusão:** Todos os fluxos principais validados end-to-end, incluindo código expirado/revogado (VIT-33 complementação). Nenhum bloqueador crítico encontrado. 17/17 PASS.
