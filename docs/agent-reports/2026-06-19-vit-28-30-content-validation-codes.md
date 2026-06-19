# Relatório de Execução — VIT-28/30

**Data:** 2026-06-19  
**Agente:** Claude Sonnet 4.6  
**Branch:** `feat/vit-28-30-content-validation-codes`  
**Base:** `master` (pós-merge dos PRs #1 e #2)

---

## 1. Escopo

| Issue | Descrição | Status |
|---|---|---|
| VIT-28 | Reforçar validate-content para categorias de erro e critérios pedagógicos | ✅ Completo |
| VIT-30 | Parametrizar geração de códigos por arquivo local não versionado | ✅ Completo |

---

## 2. VIT-28 — Validação pedagógica reforçada

### Regras novas (erros bloqueantes)

| Regra | Nível | Descrição |
|---|---|---|
| `concept` block obrigatório | ERROR | Cada missão deve ter ao menos um bloco `concept` |
| `worked_example` block obrigatório | ERROR | Cada missão deve ter ao menos um bloco `worked_example` |
| `errorCategory` inválida em opção incorreta | ERROR | Opção incorreta com `errorCategory === null` ou valor fora da lista bloqueante |
| `errorCategory` não-null em opção correta | ERROR | Opção correta não deve ter `errorCategory` (deve ser `null`) |

### Regras novas (warnings)

| Regra | Nível | Descrição |
|---|---|---|
| `skillTag` ausente por questão | WARNING | Campo recomendado para rastreabilidade |
| Nenhuma questão `challenge` | WARNING | Distribuição mínima de dificuldade recomendada |
| Nenhuma questão `basic` | WARNING | Distribuição mínima de dificuldade recomendada |
| Feedback numérico ausente | WARNING | `numericFeedbackCorrect`/`numericFeedbackWrong` recomendados para questões numéricas |
| Questão fora de `challenge` em `challengeQuestions` | WARNING | Seção opcional deve conter apenas difficulty=challenge |

### Valores válidos de `errorCategory` (não-null)

```
interpretação, fórmula inadequada, identificação de elementos,
operação algébrica, sinal, cálculo numérico, conceito base,
pressa/chute, unidade de medida, proporção
```

Esses valores espelham o tipo `ErrorCategory` em `src/types/index.ts`.

### Resultado no conteúdo atual

Conteúdo `revisao-9ano-triangulos-sistemas.json` com as novas regras:

```
Result: 0 error(s), 0 warning(s)
✓ Content is valid. Ready to import.
```

- 4 missões com `concept` + `worked_example` ✅
- Todas as opções incorretas têm `errorCategory` válida ✅
- Todas as opções corretas têm `errorCategory: null` ✅
- Distribuição de dificuldades completa (basic + intermediate + challenge) em todas as missões ✅
- Nenhuma inconsistência estrutural encontrada

### Limitações

- O validator **não resolve gabaritos matemáticos** — verifica apenas estrutura, presença e categorias.
- O campo `errorCategory` das opções incorretas é verificado contra a lista do tipo, mas a pertinência pedagógica (se a categoria escolhida é correta para aquele erro específico) requer revisão humana.

---

## 3. VIT-30 — Geração de códigos por arquivo local

### Problema anterior

`scripts/generate-access-codes.ts` tinha a lista de alunos **hardcoded** no código-fonte, comentada ou com placeholder. Risco de dados reais de alunos serem commitados acidentalmente.

### Solução

O script agora lê alunos de um arquivo JSON local:

- **Padrão:** `data/students.local.json` (criado pelo professor, nunca commitado)
- **Override via arg:** `tsx scripts/generate-access-codes.ts outro-arquivo.json`

### Formato do arquivo

```json
{
  "revisionSlug": "revisao-9ano-triangulos-sistemas",
  "daysValid": 15,
  "students": [
    { "displayName": "Nome Exibição", "grade": "9º ano", "groupLabel": "Turma A" }
  ]
}
```

Campos:
| Campo | Tipo | Descrição |
|---|---|---|
| `revisionSlug` | string | Slug da revisão no banco |
| `daysValid` | number | Dias de validade do código a partir de hoje |
| `students[].displayName` | string | Nome ou apelido para exibição (não identificação) |
| `students[].grade` | string | Série (ex: "9º ano") |
| `students[].groupLabel` | string? | Turma (opcional) |

### Proteção por `.gitignore`

```
# .gitignore
data/*.local.*
```

Padrão cobre `students.local.json`, `turma.local.json` e qualquer outro arquivo local. O Git ignora automaticamente — `git status` não mostrará o arquivo.

Verificação:
```
git check-ignore -v data/students.local.json
→ .gitignore:26:data/*.local.*    data/students.local.json  (ignorado ✓)

git check-ignore -v data/students.sample.json
→ (sem output = não ignorado, commitado normalmente ✓)
```

### Arquivo de exemplo versionado

`data/students.sample.json` — sem dados reais:
```json
{
  "revisionSlug": "revisao-9ano-triangulos-sistemas",
  "daysValid": 15,
  "students": [
    { "displayName": "Aluno Exemplo A", "grade": "9º ano", "groupLabel": "Turma A" },
    { "displayName": "Aluno Exemplo B", "grade": "9º ano", "groupLabel": "Turma A" },
    { "displayName": "Aluno Exemplo C", "grade": "9º ano", "groupLabel": "Turma B" }
  ]
}
```

### Erro amigável quando arquivo local não existe

```
Student file not found: data/students.local.json

Copy the sample and edit it:
  cp data/students.sample.json data/students.local.json

data/students.local.json is gitignored and will not be committed.
```

### Saída do script (apenas nome + código)

```
─────────────────────────────────────────────────
Nome Exibição A                → QC-AB-1234
Nome Exibição B                → QC-CD-5678
─────────────────────────────────────────────────
2/2 código(s) gerado(s).
Guarde esses códigos — eles não ficam salvos no banco em texto puro.
```

Nenhum hash, ID, ou dado interno é impresso.

### Modo --dry-run (refinamento — rodada 2)

Adicionado `--dry-run` ao script para validação sem banco, sem credenciais, sem geração de código:

```
tsx scripts/generate-access-codes.ts data/students.sample.json --dry-run
```

**Saída do dry-run:**
```
[DRY-RUN] Validating student file — no codes will be generated.

  File        : data/students.sample.json
  revisionSlug: revisao-9ano-triangulos-sistemas
  daysValid   : 15
  students    : 3 entries

[DRY-RUN] File format is valid.
[DRY-RUN] No codes generated. Nothing written to the database.
```

**Validações do dry-run:**
- `revisionSlug`: string não vazia
- `daysValid`: número positivo
- `students`: array não vazio com `displayName` e `grade` por entrada
- `groupLabel`: string se presente, ou ausente

**Arquivo inválido retorna exit 1:**
```
Invalid file format in bad.json:
  ✗ revisionSlug must be a non-empty string
  ✗ daysValid must be a positive number
  ✗ students must be a non-empty array
```

**Script `test:generate-codes`** adicionado em `package.json`:
```json
"test:generate-codes": "tsx scripts/generate-access-codes.ts data/students.sample.json --dry-run"
```

O dry-run **também está integrado em `npm test`** — roda como última etapa da bateria. Sem credenciais necessárias, seguro para CI.

---

## 4. Arquivos alterados/criados

| Arquivo | Mudança |
|---|---|
| `scripts/validate-content.ts` | Regras pedagógicas + errorCategory + distribuição de dificuldade |
| `scripts/generate-access-codes.ts` | Lê de arquivo local + modo `--dry-run` sem Supabase |
| `data/students.sample.json` | Criado — exemplo sem dados reais |
| `.gitignore` | Adicionado padrão `data/*.local.*` |
| `package.json` | Scripts `test:generate-codes` + dry-run integrado em `npm test` |
| `docs/agent-reports/...` | Relatório |

---

## 5. Comandos executados e resultados

| Comando | Resultado |
|---|---|
| `npm ci` | ✅ |
| `npm run lint` | ✅ (1 warning pré-existente em server.ts) |
| `npm run type-check` | ✅ |
| `npm run build` | ✅ |
| `npm run validate-content:ci` | ✅ 0 errors, 0 warnings |
| `npm test` | ✅ **48/48** (14 code + 20 session + 13 rate-limit + 1 dry-run) |
| `npm run test:generate-codes` | ✅ Dry-run sem credenciais |
| `generate-access-codes.ts` sem arquivo | ✅ Erro amigável + instrução |
| `generate-access-codes.ts --dry-run` com arquivo inválido | ✅ Exit 1 com erros detalhados |

---

## 6. Pendências humanas

1. **Criar `data/students.local.json`** antes de gerar códigos reais (usar sample como base)
2. **Carregar `.env.local`** antes de rodar `npm run generate-codes`
3. **Guardar os códigos gerados** imediatamente após a execução — não há como recuperá-los do banco
4. Futuro: generalizar `validate-content:ci` para descobrir automaticamente todos os arquivos em `content/revisions/`

---

## 7. Confirmações

- ✅ `.env.local` não foi commitado
- ✅ Nenhum secret foi impresso ou versionado
- ✅ Nenhum dado real de aluno foi usado
- ✅ `students.local.json` não existe no repositório
- ✅ `students.sample.json` contém apenas dados fictícios
- ✅ Nenhum hash completo foi impresso em testes
- ✅ Dry-run não requer `NEXT_PUBLIC_SUPABASE_URL` nem `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Dry-run não gera código bruto, não grava no banco
- ✅ Nenhum serviço pago foi adicionado
- ✅ Nenhuma IA foi adicionada ao runtime do app
- ✅ Nenhum deploy foi feito
- ✅ Nenhum merge foi feito
- ✅ Supabase CLI não foi configurado
- ✅ CI continua passando (48/48 testes)
