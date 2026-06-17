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
