# Checklist Autoral e Revisão Humana

**Revisão:** `[revisionSlug]`  
**Data:** `[YYYY-MM-DD]`  
**Revisor:** `[nome]`

---

## 1. Origem do material

- [ ] A origem do material está registrada em `provenance.json`
- [ ] O `sourceId` referenciado existe em `content/pipeline/provenance/`
- [ ] A origem é conhecida e documentada (não "material desconhecido")

## 2. Licença e permissão

- [ ] A licença ou permissão de uso está registrada no `provenance.json`
- [ ] O uso pretendido (educacional, adaptação autoral) é compatível com a licença
- [ ] Materiais com `copyrightRisk: "high"` tiveram revisão de copyright feita por humano

## 3. Risco autoral

- [ ] O conteúdo final **não reproduz trechos longos** do material original
- [ ] Todo texto pedagógico (explicações, blocos, feedbacks) foi **reescrito de forma autoral**
- [ ] As questões foram **criadas ou reescritas** pelo autor — não são cópias de questões de provas ou apostilas protegidas
- [ ] Não há reprodução de tabelas, imagens ou figuras protegidas

## 4. Questões

- [ ] Cada questão foi lida e verificada
- [ ] Gabaritos conferidos manualmente (a alternativa `isCorrect: true` é de fato a correta)
- [ ] Nenhuma questão contém placeholder como "[PLACEHOLDER]" ou "[REESCREVA]"
- [ ] Feedbacks das alternativas são pedagógicos e específicos (não genéricos)
- [ ] Categorias de erro fazem sentido para o erro descrito
- [ ] Há pelo menos 1 questão `basic` e 1 `challenge` por missão

## 5. Blocos de conteúdo

- [ ] Cada missão tem bloco `concept` com ideia antes da fórmula
- [ ] Cada missão tem bloco `worked_example` com problema resolvido passo a passo
- [ ] Nenhum bloco contém texto copiado de material protegido
- [ ] Linguagem adequada ao público (sem infantilização, sem jargão excessivo)

## 6. Dados e privacidade

- [ ] Nenhum dado pessoal real de aluno no JSON
- [ ] Nenhum nome, CPF, e-mail ou apelido de pessoa real nas questões
- [ ] Situações-problema usam personagens fictícios, se necessário

## 7. Reprodução excessiva

- [ ] O conteúdo final não reproduz mais do que o necessário para fins pedagógicos
- [ ] O texto foi transformado e reelaborado, não apenas parafraseado superficialmente

## 8. Imagens e tabelas

- [ ] Se houver referência a diagramas (`diagramId`), o componente visual é original ou licenciado
- [ ] Nenhuma imagem protegida de terceiros é referenciada ou incorporada

## 9. Validação técnica

- [ ] `npm run validate-content -- <draft.json>` passou com **0 erros**
- [ ] Nenhum warning foi ignorado sem justificativa documentada

## 10. Aprovação final

- [ ] O revisor confirma que este conteúdo pode ser promovido para `content/revisions/`
- [ ] O revisor confirma que este conteúdo pode ser importado para Supabase

---

**Resultado:**

- [ ] APROVADO — promover para `content/revisions/` e importar
- [ ] REPROVADO — motivo: `[descreva]`

**Assinatura do revisor:** `[nome]` em `[data]`

---

> **Regra absoluta:** nenhum draft vira `content/revisions/*.json` sem este checklist preenchido e aprovado.
