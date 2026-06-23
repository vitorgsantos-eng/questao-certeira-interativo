# DECISIONS.md — Decisões arquiteturais

## 1. Por que não há login com e-mail/senha no MVP

**Decisão:** usar código individual + cookie de sessão, sem login completo.

**Motivo:** o público é de alunos do Ensino Fundamental, muitos sem e-mail próprio. Login convencional criaria atrito desnecessário, risco de coleta de dados desnecessários e complexidade fora do escopo do MVP.

**Trade-off:** segurança menor que login convencional. Mitigado por: código com validade, hash no banco, cookie httpOnly.

---

## 2. Por que usar código individual

**Decisão:** cada aluno recebe um código único (ex: QC-AB-1234) com validade de 15 dias.

**Motivo:** identifica o aluno sem coletar dados pessoais além do apelido. Permite rastrear progresso individual. Pode ser revogado pelo professor.

---

## 3. Por que não usar IA dentro do app

**Decisão:** o app não chama nenhuma API de IA em produção.

**Motivo:** APIs de IA geram custo por uso, sem garantia de gratuidade permanente. O conteúdo pedagógico é pré-gerado, revisado e importado como JSON. IA é usada apenas como ferramenta de construção, não como dependência do produto.

---

## 4. Por que usar Supabase Free

**Decisão:** banco Postgres no plano gratuito do Supabase.

**Motivo:** oferece 500 MB de storage, 50.000 MAU, Row Level Security, cliente TypeScript oficial. Suficiente para o MVP e fase de teste controlado sem custo.

**Risco:** projeto pode ser pausado após 7 dias sem atividade (pausa por inatividade no plano gratuito). Mitigado por uso regular durante o piloto.

---

## 5. Por que evitar Vercel Hobby em fase comercial

**Decisão:** Vercel Hobby é usada apenas em desenvolvimento e validação técnica (sem finalidade comercial). Para oferta paga, migrar para Netlify Free ou Cloudflare Pages.

**Motivo:** Termos do Vercel Hobby proíbem uso comercial sem plano pago.

---

## 6. Por que o conteúdo não fica em `/public`

**Decisão:** questões, gabaritos e feedbacks são servidos via Route Handlers do Next.js, não como arquivos estáticos em `/public`.

**Motivo:** conteúdo em `/public` é acessível sem autenticação. Qualquer pessoa poderia baixar as questões e gabaritos completos, comprometendo a integridade pedagógica.

---

## 7. Por que usar JSON versionado no Git

**Decisão:** conteúdo pedagógico vive em `content/revisions/*.json`, versionado no Git, e é importado para o Supabase via script.

**Motivo:** permite revisão, auditoria, rollback e trabalho colaborativo no conteúdo sem depender do banco diretamente. Facilita auditoria pedagógica antes do deploy.

---

## 8. Por que o painel professor é simples

**Decisão:** `/professor` é uma página simples com lista de alunos e progresso, sem CRUD completo.

**Motivo:** painel administrativo completo está fora do escopo do MVP. O objetivo é ter visibilidade sobre o desempenho do grupo, não gerenciar o sistema completo.

---

## 9. Por que não há ranking público

**Decisão:** o app não exibe ranking entre alunos.

**Motivo:** ranking público entre alunos pode gerar constrangimento, comparação negativa e desmotivação — especialmente em público com baixa autoestima em Matemática. O feedback é sempre individual.

---

## 10. (Bloco 5) Por que separar motor fixo de pacote de revisão

**Decisão:** motor e conteúdo são camadas independentes. O motor nunca hardcoda slug, título, grade ou assunto de uma revisão específica. O pacote de revisão vive em JSON versionado e no banco.

**Motivo:** permitir múltiplas revisões sem alterar o código do motor. Uma nova revisão é adicionada por configuração (novo JSON + importação), não por programação.

**Fronteira documentada em:** `docs/architecture/motor-content-boundary.md`

---

## 11. (Bloco 5) Por que adicionar schemaVersion ao pacote de revisão

**Decisão:** todo pacote de revisão deve declarar `schemaVersion: "1.0"`.

**Motivo:** permite ao validador e ao motor detectar incompatibilidade entre a versão do schema esperada e a versão do pacote importado, facilitando migração futura sem quebrar pacotes antigos abruptamente.

---

## 12. (Bloco 5) Por que a homepage é dinâmica e não hardcoded

**Decisão:** a homepage busca revisões ativas do banco (se configurado) e as exibe dinamicamente. Se não configurado, mostra landing genérica sem slug hardcoded.

**Motivo:** homepage hardcoded à revisão piloto impedia o motor de funcionar com múltiplas revisões. O aluno sempre chega pela URL `/acessar/[slug]` enviada pelo professor; a homepage é só referência genérica.

---

## 13. (Bloco 5) Por que componentes visuais específicos ficam em src/components/visuals/

**Decisão:** diagramas didáticos específicos de uma revisão (`TrigonometryDiagram`, `SimilarTrianglesDiagram`, etc.) ficam em `src/components/visuals/` e são referenciados por `diagramId` no JSON.

**Motivo:** o motor precisa renderizar visuais específicos sem saber antecipadamente quais existem. O `diagramId` no JSON permite que novos diagramas sejam adicionados registrando-se apenas um ID no switch do motor e criando o componente — sem alterar o motor em outros pontos.

**Trade-off:** o motor ainda precisa conhecer os IDs dos diagramas para renderizá-los. Para uma segunda revisão com novos diagramas, o motor precisará ser atualizado com os novos IDs. Isso é aceitável no MVP; uma solução mais genérica (registro dinâmico) pode ser feita em bloco futuro.

---

## 14. (Bloco 6) Por que usar pipeline intermediário com blueprint

**Decisão:** criar um formato intermediário (blueprint pedagógico) entre o material bruto e o JSON final, em vez de gerar JSONs diretamente de PDFs.

**Motivo:** um PDF bruto não contém intenção pedagógica estruturada. O blueprint força o autor a definir objetivos, conceitos, exemplos e planejamento de questões antes de gerar qualquer JSON. Isso impede geração de conteúdo pobre e reduz retrabalho.

---

## 15. (Bloco 6) Por que usar pdf-parse como devDependency

**Decisão:** `pdf-parse` (Apache-2.0) adicionado como `devDependency` para extração local de texto de PDFs textuais.

**Motivo:** pacote gratuito, permissivo, sem API externa, sem custo. Usado apenas em scripts locais de pipeline — nunca no runtime do app. OCR não está no escopo deste bloco.

**Risco mitigado:** `pdf-parse` não funciona com PDFs escaneados. O script detecta extração insuficiente e alerta o operador, sem silenciar o problema.

---

## 16. (Bloco 6) Por que drafts ficam em content/pipeline/drafts/, não em content/revisions/

**Decisão:** drafts gerados pelo pipeline ficam em `content/pipeline/drafts/` e só são promovidos para `content/revisions/` após checklist autoral aprovado por humano.

**Motivo:** drafts contêm placeholders que precisam ser reescritos. Promover automaticamente para `content/revisions/` aumentaria o risco de importar conteúdo não revisado para o banco. O gate humano é obrigatório.

---

## 17. (Bloco 6) Por que provenance.json é obrigatório por revisão

**Decisão:** toda revisão gerada pelo pipeline deve ter um arquivo `provenance.json` rastreando a origem do material.

**Motivo:** sem rastreabilidade, é impossível auditar riscos autorais futuros. O provenance também serve como documentação pedagógica: por que este material foi usado, quem aprovou, e que uso é permitido.
