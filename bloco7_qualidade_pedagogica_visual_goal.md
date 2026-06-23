# BLOCO 7 — QUALIDADE PEDAGÓGICA, VISUAL E MATEMÁTICA DO PILOTO

## 1. Objetivo macro

Elevar a qualidade do **Questão Certeira Interativo** antes de criar novas revisões em escala.

Este bloco existe para transformar o piloto em um padrão mínimo de qualidade do motor. O app deve permitir que um aluno aprenda o conteúdo **do zero**, sem depender de apostila, aula externa, vídeo externo, explicação oral do professor ou material auxiliar.

O foco não é criar nova revisão. O foco é **melhorar a revisão piloto existente e formalizar critérios de qualidade reutilizáveis** para todas as próximas revisões.

---

## 2. Estado de entrada

Considerar como estado inicial:

- PR #14 mergeado e publicado em produção.
- PR #15 mergeado, entregando o Bloco 6 — Pipeline externo de PDFs.
- Motor reutilizável ativo.
- Supabase real já validado em smoke test.
- Pipeline externo já existente, mas ainda sem primeira revisão real nova.
- Revisão piloto atual: `content/revisions/revisao-9ano-triangulos-sistemas.json`.
- Questões/fluxos principais funcionando.
- KaTeX já existe via `src/components/math/MathText.tsx`, mas a experiência visual das fórmulas ainda precisa ser auditada e melhorada.
- Já existem issues relacionadas no Linear:
  - VIT-48 — renderizar fórmulas matemáticas de forma elegante;
  - VIT-50 — revisar conteúdo piloto para aprendizagem guiada do zero;
  - VIT-51 — recursos visuais didáticos;
  - VIT-28 — reforçar validações pedagógicas;
  - VIT-34 — revisar gabaritos e feedbacks.

---

## 3. Problema a resolver

O produto ainda pode estar funcionando como uma revisão para quem já teve aula, mas o objetivo do MVP é maior:

> O aluno deve conseguir abrir a revisão, estudar por missões curtas e entender o conteúdo mesmo que esteja começando do zero.

Problemas percebidos:

1. Fórmulas ainda podem aparecer visualmente pobres, pequenas, misturadas no texto ou dependentes de marcação inconsistente.
2. Aulas podem estar densas, resumidas ou orientadas a revisão, não a aprendizagem progressiva.
3. Elementos visuais ainda são insuficientes para um aluno com dificuldade.
4. O schema e os validadores ainda não forçam critérios pedagógicos de qualidade.
5. O pipeline de PDFs precisa herdar esses critérios antes de gerar novas revisões.

---

## 4. Princípios obrigatórios

### 4.1. Aprendizagem do zero

Cada missão deve partir do pressuposto de que o aluno:

- não lembra a fórmula;
- não sabe quando usar a fórmula;
- confunde conceitos parecidos;
- precisa ver exemplos antes de resolver sozinho;
- precisa entender o motivo do erro, não só saber que errou.

### 4.2. Qualidade visual é parte da pedagogia

Fórmula feia, diagrama ausente ou texto denso reduzem aprendizagem. Portanto:

- fórmulas centrais devem ter destaque visual;
- fórmulas longas devem ser exibidas como bloco ou card, não apenas inline;
- cada conceito abstrato deve ter apoio visual, analogia ou representação gráfica;
- diagramas devem explicar, não decorar.

### 4.3. Motor reutilizável com padrão mínimo

Este bloco deve gerar critérios que futuras revisões deverão seguir.

Não basta melhorar a revisão piloto. É obrigatório documentar e, quando possível, validar automaticamente o padrão de qualidade.

---

## 5. Escopo permitido

O agente pode alterar:

- `content/revisions/revisao-9ano-triangulos-sistemas.json`;
- componentes de renderização matemática;
- componentes de blocos didáticos;
- componentes de quiz/feedback/relatório quando necessário para melhorar fórmulas e visual;
- componentes visuais existentes ou novos componentes visuais específicos do piloto;
- `scripts/validate-content.ts` ou novos validadores de qualidade;
- `content/schemas/revision.schema.json`, se necessário e compatível;
- documentação em `docs/content/`, `docs/architecture/`, `ROADMAP.md`, `CHECKLISTS.md`, `DECISIONS.md`;
- relatório em `docs/agent-reports/`;
- testes/scripts npm, se necessário.

---

## 6. Fora de escopo

Não fazer neste bloco:

- criar nova revisão real;
- importar nova revisão no Supabase;
- alterar Supabase remoto;
- alterar Vercel;
- alterar autenticação/códigos;
- adicionar IA ao app;
- adicionar API paga;
- adicionar serviço externo pago;
- adicionar OCR;
- criar login completo;
- mudar modelo de dados do banco, salvo se absolutamente inevitável e documentado;
- substituir o motor inteiro;
- remover o pipeline externo do Bloco 6.

---

## 7. Tarefas obrigatórias

## Tarefa 0 — Baseline e branch

1. Atualizar `master`.
2. Criar branch pequena e explícita, por exemplo:

```bash
feat/qualidade-pedagogica-visual-piloto
```

3. Rodar baseline antes de alterar:

```bash
npm ci
npm run lint
npm run type-check
npm run build
npm run validate-content:all
npm test
npm run pipeline:validate-demo
```

4. Registrar qualquer warning pré-existente.

---

## Tarefa 1 — Auditoria rápida de renderização matemática

Auditar onde fórmulas aparecem:

- blocos didáticos;
- exemplos resolvidos;
- hints;
- summaries;
- enunciados de questão;
- alternativas;
- feedbacks;
- respostas corretas;
- questões numéricas;
- simulado;
- revisão de erros;
- relatório do aluno, se exibir respostas/fórmulas.

Verificar se:

- `MathText` é usado em todas as superfícies relevantes;
- fórmulas longas não ficam visualmente espremidas;
- frações, raízes, expoentes e sistemas aparecem de forma legível;
- expressões com `$...$` são renderizadas corretamente;
- conteúdo legado sem `$...$` não depende apenas de fallback visual pobre.

### Entrega esperada

Criar ou atualizar documento:

```txt
docs/content/math-rendering-quality.md
```

O documento deve conter:

- convenção oficial de fórmulas;
- exemplos de inline math;
- exemplos de fórmula em destaque;
- quando usar `$...$`;
- quando usar bloco visual/card;
- padrões proibidos.

---

## Tarefa 2 — Melhorar renderização de fórmulas

Se necessário, evoluir `MathText` ou criar componentes auxiliares para:

- fórmula inline curta;
- fórmula destacada em card;
- lista de fórmulas centrais;
- passo algébrico em exemplo resolvido;
- sistema de equações;
- frações longas.

Critérios:

- manter KaTeX;
- não usar API externa;
- não usar imagem para fórmula;
- preservar segurança: LaTeX vem de JSON controlado, nunca de input de usuário;
- manter fallback seguro em caso de erro.

Sugestão possível:

```txt
src/components/math/MathFormulaBlock.tsx
src/components/math/FormulaList.tsx
```

ou evolução controlada de `MathText.tsx`.

Não adicionar complexidade desnecessária.

---

## Tarefa 3 — Definir padrão pedagógico mínimo do motor

Criar documento:

```txt
docs/content/quality-standard.md
```

Esse documento deve definir o padrão mínimo de qualquer revisão do motor.

Cada missão deve conter, no mínimo:

1. **Abertura contextual**
   - explicar para que aquilo serve;
   - usar linguagem adequada ao aluno;
   - não presumir conhecimento prévio excessivo.

2. **Vocabulário e pré-requisitos**
   - explicar termos essenciais;
   - revisar pré-requisito curto quando necessário.

3. **Conceito central**
   - explicar antes da fórmula;
   - usar analogia ou exemplo intuitivo.

4. **Fórmula com sentido**
   - apresentar a fórmula;
   - explicar cada símbolo;
   - mostrar quando usar e quando não usar.

5. **Elemento visual obrigatório**
   - diagrama, esquema, tabela, card visual ou mapa de raciocínio.

6. **Exemplo resolvido passo a passo**
   - pelo menos 2 exemplos por missão quando o tema for matemático;
   - passos numerados;
   - conclusão interpretada.

7. **Erros comuns**
   - pelo menos 2 erros típicos por missão;
   - explicar por que o erro parece tentador;
   - explicar como evitar.

8. **Prática guiada**
   - questões básicas antes das intermediárias;
   - questão challenge apenas após base suficiente.

9. **Feedback pedagógico**
   - feedback correto explica o raciocínio;
   - feedback incorreto diagnostica o erro;
   - feedback não pode ser genérico.

10. **Resumo acionável**
   - lista do que o aluno deve lembrar;
   - fórmula central;
   - estratégia de resolução.

---

## Tarefa 4 — Reescrever/melhorar a revisão piloto

Melhorar `content/revisions/revisao-9ano-triangulos-sistemas.json` para que as quatro missões ensinem do zero:

1. Semelhança de Triângulos;
2. Relações Métricas no Triângulo Retângulo;
3. Trigonometria no Triângulo Retângulo;
4. Sistemas com Equações do 2º Grau.

Para cada missão:

- revisar blocos existentes;
- adicionar explicações se o conteúdo estiver resumido demais;
- adicionar vocabulário e pré-requisitos;
- melhorar exemplos resolvidos;
- melhorar fórmulas centrais;
- adicionar ou melhorar elementos visuais;
- revisar feedbacks;
- revisar gabaritos;
- manter pelo menos 5 questões por missão;
- manter progressão básica → intermediária → desafio.

### Atenção

Não transformar cada missão em apostila longa. A missão deve continuar curta, mas suficiente.

Preferir:

- blocos claros;
- passos pequenos;
- exemplos bem escolhidos;
- feedbacks explicativos;
- visual didático.

Evitar:

- texto corrido grande;
- jargão sem explicação;
- fórmula jogada sem sentido;
- excesso de teoria;
- questões que exigem conteúdo não explicado antes.

---

## Tarefa 5 — Elementos visuais didáticos

Garantir que cada missão tenha pelo menos um elemento visual útil.

Pode melhorar componentes existentes ou adicionar novos componentes específicos.

Exemplos aceitáveis:

- diagrama de triângulos semelhantes com lados correspondentes destacados;
- triângulo retângulo com catetos, hipotenusa, projeções e altura;
- tabela visual de seno/cosseno/tangente;
- card de estratégia para montar sistema;
- mapa de decisão: “qual fórmula usar?”;
- card “erro comum vs caminho correto”.

Critérios dos visuais:

- devem ajudar o aluno a entender;
- devem ter legenda;
- devem funcionar em mobile;
- devem usar identidade visual do projeto;
- não devem depender de imagem externa;
- devem ser SVG/HTML/CSS interno ou componente React.

---

## Tarefa 6 — Reforçar validação de qualidade

Atualizar `scripts/validate-content.ts` ou criar um novo script, por exemplo:

```txt
scripts/validate-content-quality.ts
```

Objetivo: capturar problemas que hoje passam na validação estrutural.

Validações recomendadas:

- missão sem `diagram` ou bloco visual → erro ou warning forte;
- missão com menos de 2 `worked_example` em Matemática → warning forte ou erro;
- feedback muito curto ou genérico → warning;
- presença de `[PLACEHOLDER]` em revisão final → erro;
- fórmulas prováveis sem `$...$` → warning;
- bloco `concept` curto demais → warning;
- ausência de `hint` ou `summary` → warning;
- ausência de dificuldade `basic` e `challenge` → warning/erro;
- opções incorretas sem `errorCategory` → erro já existente deve permanecer;
- questão sem explicação pedagógica no feedback → warning.

Adicionar script npm se criado:

```json
"validate-content:quality": "tsx scripts/validate-content-quality.ts content/revisions/"
```

E, se estável, incluir no `pipeline:validate-demo` ou documentação de release.

---

## Tarefa 7 — Atualizar o pipeline para herdar o padrão de qualidade

O Bloco 6 criou blueprint e draft. Agora o pipeline precisa saber que a qualidade mínima inclui aula autocontida.

Atualizar:

- `docs/content/blueprint-pedagogico.md`;
- `docs/content/pdf-pipeline-guide.md`;
- `content/pipeline/blueprints/schema.json`, se necessário;
- `scripts/pipeline/validate-blueprint.ts`, se necessário.

O blueprint deve exigir ou orientar:

- pré-requisitos;
- vocabulário essencial;
- conceitos;
- fórmulas centrais;
- elementos visuais previstos;
- exemplos resolvidos;
- erros comuns;
- critérios de feedback;
- status de revisão humana.

Não precisa tornar o schema excessivamente rígido, mas o padrão deve estar claro.

---

## Tarefa 8 — Testes e smoke test visual

Rodar obrigatoriamente:

```bash
npm run lint
npm run type-check
npm run build
npm run validate-content:all
npm test
npm run pipeline:validate-demo
```

Se criar novo script:

```bash
npm run validate-content:quality
```

Fazer smoke test visual local ou em preview:

- homepage;
- acesso a revisão 9º ano;
- mapa de missões;
- cada missão;
- pelo menos uma questão de múltipla escolha;
- pelo menos uma questão numérica;
- feedback correto;
- feedback incorreto;
- simulado;
- relatório;
- mobile 390px.

Registrar evidências no relatório.

---

## Tarefa 9 — Documentação e rastreabilidade

Atualizar:

- `ROADMAP.md` com novo bloco: **Qualidade pedagógica e visual do piloto**;
- `CHECKLISTS.md` com checklist de qualidade pedagógica/visual;
- `DECISIONS.md` com decisões relevantes;
- `docs/content/quality-standard.md`;
- `docs/content/math-rendering-quality.md`;
- `docs/agent-reports/YYYY-MM-DD-qualidade-pedagogica-visual.md`.

O relatório deve conter:

- arquivos alterados;
- melhorias por missão;
- fórmulas/visuais melhorados;
- validações novas;
- comandos executados;
- resultados;
- pendências;
- confirmação de custo zero;
- confirmação de ausência de IA runtime;
- confirmação de ausência de secrets.

---

## 8. Critérios de aceite

O bloco só estará concluído se todos os critérios abaixo forem atendidos.

### 8.1. Critérios pedagógicos

- [ ] Cada missão permite estudar o assunto do zero.
- [ ] Cada missão explica vocabulário e pré-requisitos essenciais.
- [ ] Cada fórmula central é explicada, não apenas exibida.
- [ ] Cada missão tem pelo menos 2 exemplos resolvidos quando o tema exigir cálculo.
- [ ] Cada missão tem pelo menos 2 erros comuns explicitados ou refletidos nos feedbacks.
- [ ] As questões seguem progressão básica → intermediária → desafio.
- [ ] Feedbacks incorretos explicam o erro e indicam como corrigir.
- [ ] Feedbacks corretos explicam o raciocínio.
- [ ] Gabaritos revisados manualmente.

### 8.2. Critérios visuais

- [ ] Fórmulas centrais renderizam com KaTeX legível.
- [ ] Fórmulas longas não ficam espremidas em linha comum.
- [ ] Cada missão tem ao menos um elemento visual didático.
- [ ] Visuais possuem legenda ou explicação.
- [ ] Visuais funcionam em mobile.
- [ ] Não há dependência de imagem externa.

### 8.3. Critérios técnicos

- [ ] `npm run lint` passa.
- [ ] `npm run type-check` passa.
- [ ] `npm run build` passa.
- [ ] `npm run validate-content:all` passa.
- [ ] `npm test` passa.
- [ ] `npm run pipeline:validate-demo` passa.
- [ ] Novo validador de qualidade passa, se criado.
- [ ] Nenhum secret versionado.
- [ ] Nenhuma API paga adicionada.
- [ ] Nenhuma IA adicionada ao runtime.
- [ ] Nenhuma alteração destrutiva no banco.

### 8.4. Critérios de produto

- [ ] O piloto parece uma experiência de aprendizagem, não apenas uma lista de exercícios.
- [ ] Um aluno com dificuldade consegue entender o caminho de resolução.
- [ ] A apresentação matemática é visualmente aceitável para uso real.
- [ ] O padrão criado é reutilizável para próximas revisões.
- [ ] O pipeline do Bloco 6 foi atualizado para respeitar esse padrão.

---

## 9. Estratégia de execução recomendada

Executar em ordem:

1. Auditoria visual e pedagógica.
2. Definição do padrão de qualidade.
3. Pequenas melhorias de renderização matemática.
4. Reescrita controlada da revisão piloto.
5. Visuais por missão.
6. Validador de qualidade.
7. Atualização do pipeline/blueprint.
8. Testes.
9. Relatório.
10. PR.

Evitar mega-diff desorganizado. Se a alteração ficar grande demais, dividir em commits lógicos dentro da mesma branch:

1. docs: padrão de qualidade;
2. ui: renderização matemática/visual;
3. content: revisão piloto;
4. validation: critérios automáticos;
5. docs: roadmap/checklists/relatório.

---

## 10. Stop rules

Parar e pedir orientação se:

- for necessário adicionar dependência pesada ou paga;
- for necessário mudar schema do banco;
- for necessário alterar autenticação;
- o conteúdo ficar longo demais para a experiência de missão;
- houver dúvida pedagógica séria sobre gabarito;
- algum teste passar estruturalmente, mas a experiência visual ficar ruim;
- a revisão exigir material externo para ser compreendida.

---

## 11. Título sugerido do PR

```txt
feat(content): qualidade pedagógica e visual do piloto
```

---

## 12. Resposta final esperada do agente

Ao finalizar, responder com:

```md
## Resultado — Bloco 7: Qualidade pedagógica e visual do piloto

### PR
- Link:
- Branch:

### O que foi melhorado
- Fórmulas:
- Visuais:
- Conteúdo por missão:
- Feedbacks:
- Validações:
- Pipeline/blueprint:

### Testes
- npm run lint:
- npm run type-check:
- npm run build:
- npm run validate-content:all:
- npm test:
- npm run pipeline:validate-demo:
- validate-content:quality, se criado:

### Smoke visual
- Desktop:
- Mobile:
- Missões testadas:
- Questões testadas:
- Relatório:

### Critérios de aceite
- Atendidos:
- Pendentes:

### Confirmações
- Custo zero:
- Sem IA runtime:
- Sem secrets:
- Sem alteração Supabase/Vercel:

### Próximo passo recomendado
```

---

## 13. Observação final

Este bloco é prioritário antes de gerar novas revisões reais pelo pipeline.

Depois dele, o pipeline externo poderá produzir revisões com um padrão mais alto desde o nascimento, em vez de gerar conteúdos estruturalmente válidos, mas pobres para aprendizagem.
