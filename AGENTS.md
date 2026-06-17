# AGENTS.md — Questão Certeira Interativo

Instruções para agentes autônomos (Claude Code, Codex, Antigravity ou equivalente).

---

## Protocolo obrigatório

1. Leia `PLANO_MATRIZ.md` antes de qualquer implementação.
2. Leia `README.md`, `ROADMAP.md`, `DECISIONS.md`, `CHECKLISTS.md` e `SECURITY.md`.
3. Identifique a fase atual em `ROADMAP.md`.
4. Implemente **somente a próxima tarefa lógica** da fase atual.
5. Não avance para a próxima fase sem confirmar critérios de conclusão da fase atual.

---

## Restrições absolutas

| Proibição | Motivo |
|-----------|--------|
| Adicionar API paga de IA | PLANO_MATRIZ seção 4 |
| Adicionar qualquer dependência paga | PLANO_MATRIZ seção 4 |
| Colocar IA dentro do app | PLANO_MATRIZ seção 4.5 |
| Adicionar login completo com e-mail/senha | PLANO_MATRIZ seção 13 |
| Adicionar gateway de pagamento | PLANO_MATRIZ seção 4.2 |
| Coletar CPF, e-mail, telefone, localização | PLANO_MATRIZ seção 14 |
| Expor SUPABASE_SERVICE_ROLE_KEY no frontend | SECURITY.md |
| Colocar conteúdo protegido em `/public` | PLANO_MATRIZ seção 13.5 |
| Alterar arquitetura sem registrar decisão | DECISIONS.md |

---

## O que o agente pode fazer

- Implementar funcionalidades dentro da fase atual do ROADMAP.
- Criar componentes dentro da estrutura de pastas existente.
- Adicionar ou editar conteúdo JSON em `content/revisions/`.
- Rodar lint, type-check e build.
- Criar migrations adicionais seguindo o padrão existente.
- Registrar dívidas técnicas neste arquivo ou em DECISIONS.md.
- Atualizar ROADMAP.md ao concluir tarefas.

---

## Checklist antes de commitar

- [ ] `npm run lint` passa sem erros
- [ ] `npm run type-check` passa sem erros
- [ ] Nenhuma chave sensível em código ou variável pública
- [ ] Nenhuma dependência paga adicionada
- [ ] Nenhuma IA chamada pelo app
- [ ] Nenhum dado pessoal sensível coletado
- [ ] Documentação atualizada

---

## Relatório obrigatório ao final de cada ciclo

```
RELATÓRIO DO CICLO

1. Fase executada:
2. Objetivo:
3. Arquivos criados:
4. Arquivos alterados:
5. Funcionalidades implementadas:
6. Testes executados:
7. Resultado dos testes:
8. Riscos identificados:
9. Dívidas técnicas:
10. Próxima etapa recomendada:
11. Confirmação de custo zero: SIM/NÃO
12. Confirmação de que não adicionou IA paga: SIM/NÃO
13. Confirmação de que não adicionou coleta excessiva: SIM/NÃO
```
