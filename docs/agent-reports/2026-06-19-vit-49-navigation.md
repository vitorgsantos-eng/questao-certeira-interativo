# Relatório de Execução — VIT-49

**Data:** 2026-06-19  
**Agente:** Claude Sonnet 4.6  
**Branch:** `feat/vit-49-navigation`  
**Base:** `master` (pós-merge VIT-48 em `37869fd`)

---

## 1. Escopo

| Issue | Descrição | Status |
|---|---|---|
| VIT-49 | Navegação explícita para o aluno | ✅ Completo |

---

## 2. Auditoria de rotas — gaps identificados

### Mapa de rotas do aluno

| Rota | Componente | Gaps de navegação antes de VIT-49 |
|---|---|---|
| `/` | `page.tsx` | Sem gaps — é a raiz |
| `/acessar/[slug]` | `AccessForm` | ❌ Sem link para `/` |
| `/revisao/[slug]` | `MissionMap` | ⚠️ Logo do Header linka para a mesma página; sem link para `/` |
| `/revisao/[slug]/missao/[slug]` | `MissionPlayer` | ❌ Fase lesson sem botão de saída; ❌ fase quiz sem saída |
| `/revisao/[slug]/diagnostico` | `DiagnosticPlayer` | ❌ Fase quiz sem saída |
| `/revisao/[slug]/simulado` | `SimuladoFinal` | ❌ Fase quiz (em andamento) sem saída; ✅ pré e pós têm navegação |
| `/revisao/[slug]/relatorio` | `StudentReport` | 🐛 Bug: links de missão usavam `missionId` (UUID) em vez de `missionSlug` → 404 |

---

## 3. Mudanças implementadas

### `AccessForm` — link para página inicial

Adicionado abaixo do card:

```tsx
<Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
  ← Página inicial
</Link>
```

### `MissionMap` — link para página inicial

Adicionado ao final do conteúdo (após relatório):

```tsx
<Link href="/" className="text-xs text-brand-gray-mid hover:text-brand-navy transition-colors">
  ← Página inicial
</Link>
```

O header logo já aponta para `/revisao/${revisionSlug}` (correto — é a "home" do aluno naquele contexto). O link extra no rodapé é para o caso raro de o aluno querer sair completamente.

### `MissionPlayer` — fase lesson

Adicionado acima do header da missão:

```tsx
<Link href={`/revisao/${revisionSlug}`} className="inline-flex items-center gap-1 text-sm text-brand-gray-mid hover:text-brand-navy transition-colors">
  ← Voltar ao mapa
</Link>
```

### `MissionPlayer`, `DiagnosticPlayer`, `SimuladoFinal` — confirmação de saída durante o quiz

**v1 (anterior):** link direto `Sair ✕` navegava imediatamente sem aviso.  
**v2 (ajuste pós-inspeção):** botão `Sair ✕` abre um overlay de confirmação antes de navegar.

Comportamento:

1. Aluno clica "Sair ✕" → estado `showExitConfirm = true`
2. Overlay aparece com a mensagem:
   > "As respostas já enviadas ficam salvas, mas a atividade não será concluída."
3. "Cancelar" → `showExitConfirm = false`, permanece na atividade
4. "Sair" → `router.push(`/revisao/${revisionSlug}`)`

O título do overlay varia por contexto: "Sair da missão?", "Sair do diagnóstico?", "Sair do simulado?".

**Efeito de confirmar saída:** as tentativas já respondidas estão salvas no banco (`POST /api/attempts` é chamado imediatamente ao confirmar cada resposta). O `POST /api/progress` (status `completed`) só é chamado ao fim de todas as questões — portanto, sair deixa tentativas salvas mas missão não marcada como concluída. O aluno pode reiniciar a qualquer momento.

### `StudentReport` + `relatorio/page.tsx` — bug: links de missão

**Bug encontrado:** `StudentReport` montava links de missão usando `missionId` (UUID), mas a rota é `/revisao/[slug]/missao/[missionSlug]` e a página carrega por `slug` via DB. Isso gerava 404.

**Fix:**
- `relatorio/page.tsx`: adicionado `missionSlug: m.slug` no objeto retornado por `.map()`
- `StudentReport.tsx`: adicionado campo `missionSlug: string` à interface `MissionResult`; link agora usa `m.missionSlug`

---

## 4. Decisão: "Voltar para pergunta anterior" — NÃO implementado

**Motivo técnico:** cada resposta é salva individualmente via `POST /api/attempts` no momento em que o aluno clica "Confirmar resposta". Implementar retorno à pergunta anterior criaria tentativas duplicadas no banco para a mesma pergunta, corrompendo o histórico e as métricas de desempenho.

**Alternativa futura (fora do escopo VIT-49):** bufferizar todas as respostas em estado local e enviar em lote apenas ao completar a missão. Requer mudança arquitetural (VIT-50+ ou issue nova).

---

## 5. Responsividade mobile

Todos os elementos adicionados são:
- Links de texto com padding mínimo
- Sem layout novo — inseridos em `flex` existentes ou como linha isolada
- Testados via build (sem erros de tipagem ou lint)

Nenhum breakpoint adicional foi necessário.

---

## 6. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/components/access/AccessForm.tsx` | Link "← Página inicial" abaixo do card |
| `src/components/mission/MissionMap.tsx` | Link "← Página inicial" no rodapé do conteúdo |
| `src/components/mission/MissionPlayer.tsx` | "← Voltar ao mapa" na fase lesson; "Sair ✕" na fase quiz |
| `src/components/mission/DiagnosticPlayer.tsx` | "Sair ✕" na fase quiz |
| `src/components/simulado/SimuladoFinal.tsx` | "Sair ✕" na fase quiz em andamento |
| `src/components/reports/StudentReport.tsx` | Campo `missionSlug` adicionado à interface; links de missão corrigidos |
| `src/app/revisao/[revisionSlug]/relatorio/page.tsx` | `missionSlug: m.slug` adicionado ao objeto de resultado |

---

## 7. Resultados dos testes

### Pós-commit inicial

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ 1 warning pré-existente em `server.ts` (não relacionado) |
| `npm run type-check` | ✅ |
| `npm run build` | ✅ Compiled successfully — 9 páginas geradas |
| `npm run validate-content:ci` | ✅ 0 erros, 0 warnings |
| `npm test` | ✅ 13 passed, 0 failed |

### Pós-ajuste de confirmação de saída (v2)

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ 1 warning pré-existente (mesmo de antes) |
| `npm run type-check` | ✅ |
| `npm run build` | ✅ Compiled successfully — 9 páginas geradas |
| `npm run validate-content:ci` | ✅ 0 erros, 0 warnings |
| `npm test` | ✅ 47 passed, 0 failed |

---

## 8. Confirmações

- ✅ Nenhum deploy feito
- ✅ Revisão não importada no Supabase nesta issue
- ✅ Nenhum código de aluno gerado
- ✅ Conteúdo pedagógico não alterado
- ✅ VIT-50 e VIT-51 não tocadas
- ✅ Gabaritos não alterados
- ✅ Nenhum dado real usado
- ✅ `.env.local` não commitado
- ✅ Nenhum merge feito
- ✅ PR mantido em draft
