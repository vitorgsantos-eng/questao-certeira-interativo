# Motor vs Pacote de Revisão — Fronteira Arquitetural

**Questão Certeira Interativo — Bloco 5 (2026-06-23)**

---

## 1. Definição das camadas

### Motor fixo

O motor é o conjunto de rotas, componentes, APIs, lógica de sessão, scoring, validação e relatórios que funciona para **qualquer** revisão compatível com o schema.

O motor **nunca** deve:
- Hardcodar slug, título, grade ou assunto de uma revisão específica em lógica central
- Pressupor uma única revisão ativa
- Renderizar conteúdo de missão sem buscar os dados do pacote/banco

O motor **sempre** deve:
- Usar `[revisionSlug]` como parâmetro dinâmico nas rotas
- Buscar metadados da revisão (título, grade, status) do banco pelo slug
- Buscar missões, blocos e questões do banco associados à revisão correta
- Vincular tentativas, progresso e sessão à revisão + aluno corretos

### Pacote de revisão

O pacote é o conjunto de dados que define conteúdo, missões, questões, feedbacks e configuração visual de **uma** revisão específica.

O pacote existe como:
- Arquivo JSON em `content/revisions/[slug].json` (fonte de verdade, versionada)
- Linhas nas tabelas `revisions`, `missions`, `content_blocks`, `questions`, `question_options` do Supabase (runtime)

---

## 2. Inventário de acoplamentos identificados (2026-06-23)

### Corrigidos neste bloco

| Arquivo | Acoplamento | Correção |
|---------|------------|---------|
| `src/app/page.tsx` | Slug `revisao-9ano-triangulos-sistemas` hardcoded no link | Homepage agora busca revisões ativas do banco dinamicamente |
| `src/app/page.tsx` | Grade `9º ano` e lista de missões hardcoded no card | Card dinâmico: mostra revisões do banco ou tela genérica |
| `src/app/acessar/[revisionSlug]/page.tsx` | Fallback `revisionGrade="9º ano"` | Fallback genérico `""` |

### Permitidos por categoria

| Arquivo | Acoplamento | Categoria |
|---------|------------|-----------|
| `src/components/visuals/TrigonometryDiagram.tsx` | Diagrama específico de trigonometria | **Permitido no conteúdo** — componente visual para o pacote piloto |
| `src/components/visuals/SimilarTrianglesDiagram.tsx` | Diagrama de triângulos semelhantes | **Permitido no conteúdo** — referenciado via `diagramId: "similar-triangles"` no JSON |
| `src/components/visuals/RightTriangleMetricsDiagram.tsx` | Diagrama de relações métricas | **Permitido no conteúdo** — referenciado via `diagramId: "metric-relations"` no JSON |
| `src/lib/supabase/server.ts:88,99` | `grade: '9º Ano'` em mock de teste | **Permitido em seed/teste** — mock isolado para testes automatizados |
| `src/app/layout.tsx:15` | "Revisão interativa de Matemática" na meta description | **Aceitável** — meta SEO do site, não é lógica de motor |

---

## 3. Fronteira por camada de código

```
Motor (não deve mencionar conteúdo específico)
├── src/app/page.tsx               ← landing dinâmica
├── src/app/acessar/[revisionSlug] ← formulário de acesso
├── src/app/revisao/[revisionSlug] ← mapa de missões
├── src/app/revisao/[revisionSlug]/missao/[missionSlug]
├── src/app/revisao/[revisionSlug]/diagnostico
├── src/app/revisao/[revisionSlug]/simulado
├── src/app/revisao/[revisionSlug]/relatorio
├── src/app/professor              ← painel geral
├── src/lib/                       ← lógica central
├── src/components/ (maioria)      ← componentes genéricos
└── scripts/                       ← ferramentas de conteúdo

Conteúdo (pode mencionar a revisão específica)
├── content/revisions/*.json       ← pacotes de revisão
├── content/schemas/               ← schema formal
├── src/components/visuals/        ← visuais didáticos específicos
└── supabase/seed.sql              ← dados iniciais do piloto
```

---

## 4. Componentes visuais como conteúdo

Os componentes em `src/components/visuals/` são visuais didáticos específicos da revisão piloto. Eles são referenciados pelo campo `diagramId` nos blocos de tipo `diagram` do JSON.

O motor renderiza diagramas por ID:
```typescript
// DiagramBlock.tsx (motor)
if (block.diagramId === 'similar-triangles') return <SimilarTrianglesDiagram />
if (block.diagramId === 'metric-relations') return <RightTriangleMetricsDiagram />
if (block.diagramId === 'trigonometry') return <TrigonometryDiagram />
```

Para uma nova revisão com diferentes diagramas, basta:
1. Criar o componente visual em `src/components/visuals/`
2. Registrar o `diagramId` no switch do motor
3. Usar o `diagramId` no JSON da revisão

---

## 5. Regra para novos acoplamentos

Antes de adicionar qualquer referência a uma revisão específica no motor, perguntar:

> "Este dado existe para **todas** as revisões ou apenas para a revisão X?"

- Se para todas → pertence ao motor (generic, dinâmico)
- Se apenas para X → pertence ao pacote de conteúdo de X
