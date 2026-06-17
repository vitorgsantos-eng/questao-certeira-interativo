# PLANO MATRIZ — QUESTÃO CERTEIRA INTERATIVO

**Versão:** 0.1  
**Status:** Documento matriz inicial para construção do MVP  
**Produto:** Questão Certeira Interativo  
**Tipo:** Miniapp web educacional de Matemática  
**Público inicial:** Ensino Fundamental, com arquitetura expansível para outros níveis  
**Modelo inicial:** Teste controlado sem cobrança  
**Restrição financeira obrigatória:** não gerar custos para o proprietário durante desenvolvimento, implantação e oferta inicial a usuários controlados.

---

# 1. Finalidade deste documento

Este documento é o plano matriz do software **Questão Certeira Interativo**.

Qualquer agente autônomo, incluindo Codex, Antigravity, Claude Code ou ferramenta equivalente, deve ler este documento antes de executar qualquer tarefa no repositório.

A partir deste documento, o agente deve ser capaz de:

1. entender a visão do produto;
2. compreender o escopo do MVP;
3. respeitar as restrições de custo zero;
4. criar a estrutura inicial do projeto;
5. criar os documentos de governança do software;
6. implementar a aplicação por fases;
7. evitar funcionalidades fora do escopo;
8. garantir rastreabilidade, segurança mínima, privacidade e qualidade didática;
9. entregar uma aplicação utilizável por grupo controlado de estudantes sem gerar custos ao proprietário.

Este documento tem prioridade sobre decisões improvisadas do agente. Caso haja conflito entre este documento e sugestões automáticas do agente, o agente deve interromper a implementação daquela parte, registrar o conflito e propor alternativas.

---

# 2. Visão do produto

O **Questão Certeira Interativo** será um miniapp web de revisão matemática, acessado por link, voltado inicialmente para alunos do Ensino Fundamental que apresentam dificuldade, baixa motivação ou rejeição ao estudo de Matemática.

O produto deve transformar conteúdos de prova em experiências interativas curtas, não monótonas, visualmente modernas e pedagogicamente estruturadas.

O app não deve parecer infantil. Também não deve parecer um sistema adulto, burocrático ou excessivamente acadêmico.

A experiência deve transmitir a sensação de:

- treino;
- missão;
- progresso;
- desafio controlado;
- clareza;
- autonomia;
- preparação para prova.

A tese do produto é:

> Alunos que não gostam de Matemática podem se engajar melhor quando o estudo é apresentado em missões curtas, interativas, com explicações diretas, feedback imediato, revisão dos erros e sensação clara de avanço.

---

# 3. Objetivo do MVP

Construir um miniapp web funcional que permita:

1. cadastrar uma revisão de Matemática;
2. cadastrar missões dentro dessa revisão;
3. cadastrar conteúdos didáticos estruturados;
4. cadastrar questões com feedback por alternativa;
5. gerar códigos individuais de acesso;
6. permitir que o aluno acesse sem login;
7. permitir que o aluno faça diagnóstico inicial;
8. permitir que o aluno estude por missões;
9. permitir que o aluno responda questões;
10. exibir feedback específico por erro;
11. registrar progresso, acertos, erros, assuntos fracos e tempo aproximado;
12. permitir revisão dos erros;
13. permitir simulado final opcional;
14. exibir relatório final ao aluno;
15. exibir relatório simples ao professor/proprietário;
16. ser publicado para grupo controlado sem custos.

---

# 4. Restrições obrigatórias de custo

## 4.1 Regra principal

O software deve ser construído de modo que, na fase de MVP e teste controlado, não gere custos financeiros ao proprietário.

O agente não deve implementar, configurar ou recomendar como padrão nenhuma solução que gere cobrança, uso pago, trial com cartão obrigatório, API paga ou serviço com risco de cobrança automática.

## 4.2 Proibições no MVP

É proibido no MVP:

- usar API paga de IA dentro do app;
- usar OpenAI API, Anthropic API, Gemini API ou equivalente dentro do app em produção;
- depender de cartão de crédito para funcionamento;
- habilitar plano pago em qualquer serviço;
- configurar add-ons pagos;
- usar banco pago;
- usar autenticação paga;
- usar storage pago;
- usar serviços de e-mail transacional pagos;
- usar analytics pago;
- usar gateway de pagamento;
- usar domínio pago como requisito;
- usar recursos que cobrem por uso sem limite rígido gratuito;
- adicionar dependência que só funcione adequadamente em plano pago.

## 4.3 Serviços preferidos no MVP

Priorizar:

- Supabase Free para banco;
- hospedagem gratuita;
- Next.js;
- bibliotecas open source;
- conteúdo pré-gerado e validado;
- JSON versionado no Git;
- scripts locais;
- relatórios simples;
- painel professor simples.

## 4.4 Hospedagem

Durante teste fechado e sem cobrança:

- Vercel Hobby pode ser usada para desenvolvimento e validação técnica, desde que não haja finalidade comercial.

Para oferta externa controlada, especialmente se houver possibilidade futura de venda:

- Netlify Free deve ser considerada como alternativa preferencial de custo zero;
- Cloudflare Pages pode ser avaliada se o projeto for adaptado adequadamente;
- Vercel Pro só deve ser considerada quando houver receita esperada e decisão explícita do proprietário.

## 4.5 IA no app

No MVP, a IA será usada apenas fora do app:

- para gerar conteúdo;
- para auditar conteúdo;
- para revisar gabaritos;
- para transformar conteúdo em JSON;
- para ajudar na programação.

O app entregue ao aluno não deve chamar API de IA.

---

# 5. Público-alvo

## 5.1 Público inicial

Alunos do Ensino Fundamental, especialmente alunos com:

- dificuldade em Matemática;
- baixa motivação;
- rejeição a aulas longas;
- resistência a estudar por PDFs;
- uso natural de celular;
- necessidade de revisar para prova escolar.

## 5.2 Expansão futura

A arquitetura deve permitir expansão futura para:

- Ensino Fundamental I;
- Ensino Fundamental II;
- Ensino Médio;
- vestibulares;
- ENEM;
- concursos;
- cursos livres;
- outros componentes curriculares.

A implementação inicial, porém, deve focar no Ensino Fundamental e não deve tentar resolver todos os segmentos no MVP.

---

# 6. Conteúdo-piloto

O primeiro conteúdo-piloto será voltado a Matemática, com os seguintes temas:

1. sistemas envolvendo equações do 2º grau;
2. semelhança de triângulos;
3. relações métricas no triângulo retângulo;
4. relações trigonométricas no triângulo retângulo.

## 6.1 Ordem didática recomendada

A trilha deve sugerir a seguinte ordem:

1. Diagnóstico rápido;
2. Semelhança de triângulos;
3. Relações métricas no triângulo retângulo;
4. Relações trigonométricas no triângulo retângulo;
5. Sistemas envolvendo equações do 2º grau;
6. Simulado misto.

O aluno deve poder pular missões, mas o app deve indicar a ordem recomendada.

---

# 7. Princípios didáticos obrigatórios

O app deve ser construído com base nos seguintes princípios:

## 7.1 Ideia antes da fórmula

Sempre que possível, a missão deve começar por uma situação visual, concreta ou intuitiva antes de apresentar fórmula.

Não iniciar a explicação por fórmula quando o conteúdo permitir uma construção gradual.

## 7.2 Missões curtas

Cada missão deve ter duração estimada de 5 a 8 minutos.

O app total pode ter aproximadamente 30 a 45 minutos, mas dividido em blocos curtos.

## 7.3 Feedback que ensina

O feedback deve ensinar o aluno no erro.

Evitar:

> Errado. Resposta correta: B.

Preferir:

> Ainda não. Você usou Pitágoras, mas a questão pedia relação entre altura e projeções. Quando aparecem altura relativa à hipotenusa e as duas projeções, pense em h² = m · n.

## 7.4 Linguagem

A linguagem deve ser:

- clara;
- direta;
- madura;
- levemente desafiadora;
- encorajadora sem exagero;
- sem infantilização;
- sem jargão excessivo;
- sem tom professoral cansativo.

Exemplos aceitáveis:

- “Missão liberada.”
- “Treino rápido.”
- “Você dominou este passo.”
- “Ainda não. Veja onde o raciocínio desviou.”
- “Revisão recomendada antes do simulado.”

Exemplos a evitar:

- “Parabéns, campeãozinho!”
- “Vamos fazer continhas?”
- “Oops, tente de novo!”
- “Você ganhou estrelinha mágica!”

## 7.5 Autonomia

O aluno deve poder:

- fazer ou pular diagnóstico;
- escolher missão;
- refazer missão;
- revisar erros;
- ir ao simulado;
- voltar ao mapa de missões.

## 7.6 Microgamificação

Usar gamificação moderada:

- missões;
- progresso;
- níveis discretos;
- conquistas simples;
- desafios extras opcionais.

Evitar:

- ranking público;
- comparação entre alunos;
- moedas;
- loja;
- mascotes infantis;
- excesso de animações;
- bloqueio punitivo por erro.

---

# 8. Jornada do aluno

A jornada principal deve ser:

1. aluno recebe link e código individual;
2. acessa a página da revisão;
3. digita o código;
4. sistema valida código;
5. app salva sessão/cookie temporário;
6. aluno vê mapa de missões;
7. aluno pode fazer diagnóstico rápido ou pular;
8. aluno escolhe missão;
9. aluno vê situação-problema;
10. aluno lê explicação curta;
11. aluno acompanha exemplo guiado;
12. aluno responde questões;
13. aluno recebe feedback específico;
14. aluno conclui missão;
15. aluno vê resultado da missão;
16. aluno pode revisar erros;
17. aluno pode fazer simulado final;
18. aluno vê relatório final;
19. professor/proprietário vê relatório simples em área protegida.

---

# 9. Estrutura das missões

Cada missão deve seguir esta estrutura:

1. abertura da missão;
2. objetivo;
3. situação-problema;
4. ideia antes da fórmula;
5. explicação curta;
6. exemplo guiado;
7. 5 questões obrigatórias;
8. feedback por alternativa;
9. desafio extra opcional;
10. resumo da missão;
11. recomendação de próximo passo.

## 9.1 Quantidade de questões

Cada missão deve ter:

- 5 questões obrigatórias;
- 1 a 3 desafios extras opcionais.

## 9.2 Tipos de questão no MVP

Implementar apenas:

1. múltipla escolha;
2. resposta numérica digitada.

Não implementar no MVP:

- arrastar e soltar;
- desenho geométrico interativo;
- reconhecimento de imagem;
- chat;
- áudio;
- vídeo;
- ranking;
- multiplayer.

---

# 10. Diagnóstico inicial

O diagnóstico inicial deve ter:

- 4 questões;
- 1 questão por assunto;
- duração inferior a 5 minutos;
- opção de pular.

A tela deve apresentar:

> Antes de começar, quer fazer um diagnóstico rápido? São 4 questões para o app indicar onde você deve focar. Leva menos de 5 minutos.

Botões:

- Começar diagnóstico;
- Pular e ir para as missões.

---

# 11. Simulado final

O simulado final deve ser:

- opcional;
- acessível desde o início;
- recomendado após as missões;
- composto por questões misturadas;
- com resultado por assunto;
- com recomendação de revisão.

O app deve permitir que o aluno faça o simulado mesmo sem concluir todas as missões, mas deve informar:

> Recomendado concluir as missões antes do simulado.

---

# 12. Relatórios

## 12.1 Relatório do aluno

O relatório do aluno deve mostrar:

- percentual de acerto;
- acertos por missão;
- assuntos fortes;
- assuntos fracos;
- erros comuns;
- recomendação de revisão;
- botão para refazer missão;
- botão para revisar erros;
- status do simulado.

## 12.2 Relatório do professor

Criar página simples:

`/professor`

Acesso por senha/código de professor definido em variável de ambiente.

O relatório deve mostrar:

- lista de alunos/códigos;
- revisão associada;
- progresso;
- última atividade;
- missões concluídas;
- acertos por assunto;
- erros comuns;
- simulado concluído ou não.

Não criar painel administrativo completo no MVP.

---

# 13. Controle de acesso

## 13.1 Sem login completo

O MVP não deve ter login com e-mail e senha.

Usar:

- link da revisão;
- código individual;
- validade;
- sessão/cookie temporário.

## 13.2 Código individual

Cada aluno deve ter um código individual com validade.

Exemplo conceitual:

`QC-9A-X7K2`

O código deve estar associado a:

- estudante;
- revisão;
- status;
- data de expiração.

## 13.3 Expiração

Validade inicial:

- 15 dias.

O sistema deve bloquear código vencido.

## 13.4 Segurança do código

Preferir salvar hash do código no banco, não o código puro.

Se isso atrasar muito o MVP, registrar dívida técnica e implementar ao menos uma estrutura preparada para migração para hash.

## 13.5 Conteúdo protegido

O conteúdo protegido não deve ficar em `/public`.

O app não deve entregar conteúdo sensível ou completo sem validar o acesso.

As rotas de conteúdo devem validar sessão/código antes de retornar dados.

---

# 14. Dados pessoais e privacidade

Como o produto será usado por menores de idade, a coleta deve ser mínima.

## 14.1 Dados permitidos no MVP

Permitir apenas:

- apelido ou primeiro nome;
- série/turma;
- código de acesso;
- validade do acesso;
- progresso;
- respostas;
- acertos;
- erros;
- categoria de erro;
- tempo aproximado;
- assunto fraco.

## 14.2 Dados proibidos no MVP

Não coletar:

- CPF;
- RG;
- endereço;
- telefone do aluno;
- e-mail do aluno;
- foto;
- localização;
- data de nascimento;
- dados de saúde;
- dados sensíveis;
- conversas livres com IA;
- escola, salvo se estritamente necessário para teste controlado.

## 14.3 Princípios obrigatórios

O agente deve respeitar:

- minimização de dados;
- finalidade pedagógica;
- acesso restrito;
- ausência de coleta excessiva;
- ausência de dados sensíveis;
- proteção de dados de menores;
- transparência do que é coletado.

---

# 15. Stack técnica

## 15.1 Stack principal

Usar preferencialmente:

- Next.js;
- TypeScript;
- Tailwind CSS;
- Supabase Free;
- hospedagem gratuita;
- bibliotecas open source.

## 15.2 Backend

Usar:

- Next.js Route Handlers;
- Server Actions quando fizer sentido;
- validação no servidor;
- Supabase Client separado para server/client.

## 15.3 Banco

Usar:

- Supabase Postgres no plano gratuito.

## 15.4 Estilo visual

Usar:

- visual Questão Certeira;
- azul-marinho;
- dourado;
- fundo claro neutro;
- cards modernos;
- barras de progresso;
- microinterações discretas;
- visual de treino/performance.

## 15.5 Componentes

Criar componentes reutilizáveis:

- AccessForm;
- MissionMap;
- MissionCard;
- ProgressBar;
- LessonBlock;
- WorkedExample;
- MultipleChoiceQuestion;
- NumericQuestion;
- FeedbackBox;
- ErrorReview;
- StudentReport;
- TeacherDashboard;
- SimuladoFinal.

---

# 16. Arquitetura de pastas recomendada

Criar estrutura semelhante a:

```txt id="74yjee"
questao-certa-interativo/
├── README.md
├── PLANO_MATRIZ.md
├── ROADMAP.md
├── AGENTS.md
├── DECISIONS.md
├── CHECKLISTS.md
├── SECURITY.md
├── CONTENT_GUIDE.md
├── PRIVACY_NOTES.md
├── COST_GUARDRAILS.md
├── package.json
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── acessar/
│   │   ├── revisao/
│   │   ├── professor/
│   │   └── api/
│   ├── components/
│   │   ├── access/
│   │   ├── mission/
│   │   ├── quiz/
│   │   ├── progress/
│   │   ├── reports/
│   │   └── layout/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── auth-lite/
│   │   ├── content/
│   │   ├── scoring/
│   │   └── validation/
│   ├── types/
│   └── styles/
├── content/
│   ├── revisions/
│   │   └── revisao-9ano-triangulos-sistemas.json
│   └── schemas/
├── scripts/
│   ├── validate-content.ts
│   ├── import-revision.ts
│   └── generate-access-codes.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

# 17. Modelo de dados inicial

O agente deve criar migrations para as tabelas abaixo.

## 17.1 students

Campos mínimos:

- id;
- display_name;
- grade;
- group_label;
- created_at.

## 17.2 access_codes

Campos mínimos:

- id;
- student_id;
- revision_id;
- code_hash;
- status;
- expires_at;
- last_used_at;
- created_at.

Status possíveis:

- active;
- expired;
- revoked.

## 17.3 revisions

Campos mínimos:

- id;
- slug;
- title;
- grade;
- description;
- status;
- valid_from;
- valid_until;
- created_at.

Status possíveis:

- draft;
- active;
- archived.

## 17.4 missions

Campos mínimos:

- id;
- revision_id;
- slug;
- order_index;
- title;
- short_title;
- goal;
- prerequisites;
- estimated_minutes;
- is_optional;
- created_at.

## 17.5 content_blocks

Campos mínimos:

- id;
- mission_id;
- order_index;
- type;
- content_json;
- created_at.

Tipos aceitos:

- intro;
- concept;
- visual_explanation;
- worked_example;
- hint;
- summary.

## 17.6 questions

Campos mínimos:

- id;
- mission_id;
- order_index;
- type;
- statement;
- difficulty;
- skill_tag;
- content_json;
- correct_answer_json;
- created_at.

Tipos aceitos:

- multiple_choice;
- numeric.

Dificuldades aceitas:

- basic;
- intermediate;
- challenge.

## 17.7 question_options

Campos mínimos:

- id;
- question_id;
- order_index;
- option_text;
- is_correct;
- feedback;
- error_category.

## 17.8 attempts

Campos mínimos:

- id;
- student_id;
- revision_id;
- mission_id;
- question_id;
- answer_json;
- is_correct;
- error_category;
- time_spent_seconds;
- created_at.

## 17.9 mission_progress

Campos mínimos:

- id;
- student_id;
- revision_id;
- mission_id;
- status;
- score;
- started_at;
- completed_at;
- updated_at.

Status possíveis:

- not_started;
- in_progress;
- completed.

## 17.10 revision_progress

Campos mínimos:

- id;
- student_id;
- revision_id;
- status;
- diagnostic_score;
- final_score;
- weak_topics_json;
- completed_at;
- updated_at.

---

# 18. Formato do conteúdo JSON

O conteúdo pedagógico deve ser versionado em JSON antes de ser importado para o Supabase.

Exemplo base:

```json id="takx3n"
{
  "revisionSlug": "revisao-9ano-triangulos-sistemas",
  "title": "Revisão Interativa — Triângulos e Sistemas",
  "grade": "9º ano",
  "description": "Revisão para prova com semelhança de triângulos, relações métricas, trigonometria no triângulo retângulo e sistemas envolvendo equações do 2º grau.",
  "missions": [
    {
      "slug": "semelhanca-triangulos",
      "title": "Semelhança de Triângulos",
      "shortTitle": "Semelhança",
      "goal": "Reconhecer triângulos semelhantes e usar proporção entre lados correspondentes.",
      "estimatedMinutes": 8,
      "blocks": [
        {
          "type": "intro",
          "title": "Missão",
          "text": "Nesta missão, você vai aprender a identificar triângulos semelhantes sem depender de chute."
        },
        {
          "type": "concept",
          "title": "Ideia antes da fórmula",
          "text": "Dois triângulos são semelhantes quando têm a mesma forma, mesmo que tenham tamanhos diferentes."
        },
        {
          "type": "worked_example",
          "problem": "Dois triângulos têm lados correspondentes 3 e 6, 4 e 8, 5 e 10. Eles são semelhantes?",
          "steps": [
            "Compare os lados correspondentes.",
            "6/3 = 2.",
            "8/4 = 2.",
            "10/5 = 2.",
            "Como a razão é a mesma, os triângulos são semelhantes."
          ]
        }
      ],
      "questions": [
        {
          "type": "multiple_choice",
          "difficulty": "basic",
          "skillTag": "identify_similarity",
          "statement": "Dois triângulos têm lados correspondentes 2 e 4, 3 e 6, 5 e 10. O que podemos concluir?",
          "options": [
            {
              "text": "São semelhantes, pois todos os lados foram multiplicados por 2.",
              "isCorrect": true,
              "feedback": "Correto. A razão entre os lados correspondentes é constante.",
              "errorCategory": null
            },
            {
              "text": "Não são semelhantes, pois os lados são diferentes.",
              "isCorrect": false,
              "feedback": "Lados diferentes não impedem semelhança. Em triângulos semelhantes, o tamanho pode mudar, mas a proporção precisa ser mantida.",
              "errorCategory": "conceito base"
            },
            {
              "text": "São iguais, pois têm a mesma forma.",
              "isCorrect": false,
              "feedback": "Mesma forma indica semelhança. Para serem iguais/congruentes, precisariam ter o mesmo tamanho.",
              "errorCategory": "interpretação"
            }
          ]
        }
      ]
    }
  ]
}
```

---

# 19. Categorias de erro

Usar categorias padronizadas:

- interpretação;
- fórmula inadequada;
- identificação de elementos;
- operação algébrica;
- sinal;
- cálculo numérico;
- conceito base;
- pressa/chute;
- unidade de medida;
- proporção.

Essas categorias devem alimentar o relatório do aluno e do professor.

---

# 20. Documentos de governança obrigatórios

Ao iniciar o projeto, o agente deve criar os seguintes documentos:

## 20.1 README.md

Deve conter:

- nome do projeto;
- descrição;
- stack;
- comandos para rodar;
- variáveis de ambiente;
- estrutura de pastas;
- fluxo básico;
- observação de custo zero;
- observação de privacidade.

## 20.2 ROADMAP.md

Deve organizar o projeto em fases:

1. Setup técnico;
2. Governança;
3. Banco e Supabase;
4. Acesso por código;
5. Mapa de missões;
6. Conteúdo JSON;
7. Quiz e feedback;
8. Registro de progresso;
9. Relatórios;
10. Painel professor;
11. Testes e auditoria;
12. Piloto controlado.

## 20.3 AGENTS.md

Deve conter regras para agentes autônomos:

- ler PLANO_MATRIZ.md antes de tudo;
- ler README, ROADMAP, DECISIONS, CHECKLISTS e SECURITY;
- identificar fase atual;
- implementar apenas tarefas da fase atual;
- não adicionar custos;
- não adicionar IA no app;
- não adicionar login completo;
- não adicionar pagamento;
- não coletar dados desnecessários;
- não alterar arquitetura sem registrar decisão;
- rodar testes;
- gerar relatório final.

## 20.4 DECISIONS.md

Registrar decisões arquiteturais:

- por que não há login no MVP;
- por que usar código individual;
- por que não usar IA dentro do app;
- por que usar Supabase Free;
- por que evitar Vercel Hobby em fase comercial;
- por que conteúdo fica fora de `/public`;
- por que usar JSON versionado;
- por que painel professor é simples;
- por que não há ranking público.

## 20.5 CHECKLISTS.md

Criar checklists:

- checklist técnico;
- checklist pedagógico;
- checklist de segurança;
- checklist de privacidade;
- checklist de custo zero;
- checklist de publicação;
- checklist de teste no celular.

## 20.6 SECURITY.md

Deve conter:

- variáveis de ambiente;
- proteção de chaves;
- proibição de expor service role key no frontend;
- validação no servidor;
- controle de acesso;
- conteúdo protegido;
- sessão/cookie;
- RLS no Supabase quando aplicável;
- auditoria mínima inspirada em OWASP ASVS.

## 20.7 CONTENT_GUIDE.md

Deve conter:

- tom de linguagem;
- estrutura da missão;
- formato das questões;
- padrão de feedback;
- categorias de erro;
- exemplo de JSON;
- critérios de revisão pedagógica;
- checklist de gabarito.

## 20.8 PRIVACY_NOTES.md

Deve conter:

- dados coletados;
- dados proibidos;
- finalidade pedagógica;
- minimização de dados;
- público menor de idade;
- boas práticas de privacidade;
- orientação para teste controlado.

## 20.9 COST_GUARDRAILS.md

Deve conter:

- regra de custo zero;
- serviços permitidos;
- serviços proibidos;
- alerta sobre planos pagos;
- como verificar se uma dependência gera cobrança;
- checklist antes de deploy.

---

# 21. Regras operacionais para agentes autônomos

Todo agente deve seguir este protocolo:

1. Ler `PLANO_MATRIZ.md`;
2. Ler documentos de governança existentes;
3. Criar documentos ausentes;
4. Identificar fase atual no `ROADMAP.md`;
5. Implementar somente a próxima tarefa lógica;
6. Não implementar funcionalidades fora do escopo;
7. Não criar dependência paga;
8. Não colocar IA dentro do app;
9. Não criar login completo;
10. Não criar pagamento;
11. Não coletar dados excessivos;
12. Rodar lint;
13. Rodar build;
14. Rodar testes existentes;
15. Atualizar documentação afetada;
16. Gerar relatório final.

## 21.1 Relatório obrigatório após cada ciclo

Ao final de cada execução, o agente deve entregar:

```txt id="gjlmbk"
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
11. Confirmação de custo zero:
12. Confirmação de que não adicionou IA paga:
13. Confirmação de que não adicionou coleta excessiva de dados:
```

---

# 22. Backlog de implementação

## Fase 0 — Governança e setup

Objetivo: criar base documental e técnica.

Tarefas:

- criar projeto Next.js com TypeScript;
- configurar Tailwind;
- criar estrutura de pastas;
- criar documentos de governança;
- configurar lint;
- configurar ambiente local;
- criar `.env.example`;
- criar `COST_GUARDRAILS.md`;
- criar `CONTENT_GUIDE.md`.

Critério de conclusão:

- projeto roda localmente;
- documentos criados;
- lint configurado;
- nenhuma dependência paga adicionada.

## Fase 1 — Supabase e banco

Objetivo: criar banco e tabelas.

Tarefas:

- configurar Supabase Free;
- criar migrations;
- criar tabelas;
- criar seed inicial;
- documentar variáveis de ambiente;
- criar cliente Supabase server/client;
- não expor chaves sensíveis no frontend.

Critério de conclusão:

- tabelas existem;
- app conecta ao Supabase;
- seed funciona;
- nenhuma chave sensível exposta.

## Fase 2 — Acesso por código

Objetivo: aluno entra com código individual.

Tarefas:

- criar tela `/acessar/[revisionSlug]`;
- validar código;
- bloquear código expirado;
- criar sessão/cookie temporário;
- redirecionar para mapa de missões;
- exibir erro amigável para código inválido.

Critério de conclusão:

- código válido acessa;
- código inválido bloqueia;
- código vencido bloqueia;
- sessão temporária funciona.

## Fase 3 — Mapa de missões

Objetivo: exibir revisão e missões.

Tarefas:

- criar `/revisao/[revisionSlug]`;
- buscar revisão;
- buscar missões;
- mostrar progresso;
- indicar ordem recomendada;
- permitir pular missão;
- exibir simulado opcional.

Critério de conclusão:

- aluno vê missões;
- consegue abrir missão;
- progresso básico aparece.

## Fase 4 — Conteúdo JSON e importação

Objetivo: conteúdo versionado e importável.

Tarefas:

- criar schema JSON;
- criar `validate-content.ts`;
- criar `import-revision.ts`;
- criar conteúdo piloto mínimo;
- importar conteúdo para Supabase;
- documentar fluxo no `CONTENT_GUIDE.md`.

Critério de conclusão:

- JSON valida;
- conteúdo importa;
- missão aparece no app.

## Fase 5 — Tela de missão

Objetivo: missão didática funcional.

Tarefas:

- exibir abertura;
- exibir objetivo;
- exibir situação-problema;
- exibir explicação;
- exibir exemplo guiado;
- exibir questões;
- exibir feedback.

Critério de conclusão:

- aluno consegue concluir uma missão inteira.

## Fase 6 — Quiz e feedback

Objetivo: responder e receber feedback.

Tarefas:

- componente de múltipla escolha;
- componente de resposta numérica;
- feedback por alternativa;
- categorias de erro;
- salvar tentativa;
- calcular acertos.

Critério de conclusão:

- respostas são registradas;
- feedback aparece;
- erro é categorizado.

## Fase 7 — Progresso e relatório do aluno

Objetivo: resultado pedagógico.

Tarefas:

- calcular resultado da missão;
- calcular pontos fracos;
- listar erros;
- criar tela de revisão dos erros;
- criar relatório geral.

Critério de conclusão:

- aluno vê resultado;
- aluno vê erros;
- aluno recebe recomendação de revisão.

## Fase 8 — Simulado final

Objetivo: prova mista opcional.

Tarefas:

- criar simulado;
- misturar questões;
- registrar respostas;
- calcular resultado por assunto;
- recomendar revisão.

Critério de conclusão:

- aluno faz simulado;
- resultado aparece por assunto.

## Fase 9 — Painel professor

Objetivo: relatório simples para proprietário/professor.

Tarefas:

- criar `/professor`;
- proteger com senha/código;
- listar alunos;
- listar progresso;
- mostrar erros comuns;
- mostrar simulado.

Critério de conclusão:

- professor acessa;
- vê desempenho dos alunos;
- sem dados excessivos.

## Fase 10 — Testes e auditoria

Objetivo: preparar piloto controlado.

Tarefas:

- rodar lint;
- rodar build;
- criar testes mínimos;
- testar no celular;
- testar código inválido;
- testar código expirado;
- testar acesso indevido;
- testar conteúdo protegido;
- revisar gabaritos;
- revisar feedbacks;
- revisar privacidade;
- revisar custo zero.

Critério de conclusão:

- app utilizável por grupo controlado;
- sem custo;
- sem exposição indevida de conteúdo;
- sem coleta excessiva.

---

# 23. Critério de MVP pronto

O MVP estará pronto quando:

1. app estiver publicado em ambiente gratuito;
2. revisão puder ser cadastrada;
3. códigos individuais puderem ser gerados;
4. aluno acessar com código válido;
5. código vencido for bloqueado;
6. aluno visualizar mapa de missões;
7. aluno fizer diagnóstico ou pular;
8. aluno concluir pelo menos uma missão;
9. aluno responder questões;
10. app mostrar feedback por erro;
11. app registrar progresso;
12. aluno revisar erros;
13. aluno fizer simulado opcional;
14. aluno visualizar relatório final;
15. professor visualizar relatório simples;
16. app passar em checklist técnico;
17. app passar em checklist pedagógico;
18. app passar em checklist de privacidade;
19. app passar em checklist de custo zero;
20. app não usar API paga;
21. app não expor chaves sensíveis;
22. conteúdo protegido não estiver em `/public`.

---

# 24. Critério de rejeição

O agente deve considerar a entrega inadequada se:

- houver dependência paga;
- houver IA dentro do app;
- houver cobrança automática possível;
- houver login completo desnecessário;
- houver coleta excessiva de dados;
- o conteúdo ficar público indevidamente;
- não houver feedback pedagógico;
- o app for apenas um quiz simples;
- não houver documentos de governança;
- não houver relatório de alterações;
- não houver teste mínimo;
- não houver confirmação de custo zero.

---

# 25. Prompt operacional para agente autônomo

Use este prompt em modo goal:

```txt id="am7yzs"
Você é um agente autônomo de engenharia de software atuando no projeto Questão Certeira Interativo.

Antes de qualquer implementação, leia integralmente o arquivo PLANO_MATRIZ.md. Em seguida, verifique se existem README.md, ROADMAP.md, AGENTS.md, DECISIONS.md, CHECKLISTS.md, SECURITY.md, CONTENT_GUIDE.md, PRIVACY_NOTES.md e COST_GUARDRAILS.md.

Se esses documentos não existirem, sua primeira tarefa é criá-los de forma coerente com o PLANO_MATRIZ.md.

Objetivo geral:
construir um MVP web gratuito, sem custos para o proprietário, para revisão interativa de Matemática por missões, com acesso por código individual, conteúdo estruturado, feedback inteligente, registro de progresso e relatório simples para professor.

Restrições obrigatórias:
- não adicionar custos;
- não usar API paga;
- não colocar IA dentro do app;
- não exigir cartão de crédito;
- não implementar pagamento;
- não implementar login completo;
- não coletar dados excessivos de menores;
- não expor conteúdo protegido em /public;
- não expor chaves sensíveis no frontend;
- não fugir da fase atual do ROADMAP.md.

Stack preferida:
Next.js, TypeScript, Tailwind CSS, Supabase Free e hospedagem gratuita.

Procedimento:
1. Leia PLANO_MATRIZ.md.
2. Crie ou atualize documentos de governança.
3. Identifique a fase atual do ROADMAP.md.
4. Implemente somente a próxima etapa lógica.
5. Rode lint, build e testes disponíveis.
6. Atualize documentação se necessário.
7. Gere relatório final do ciclo.

Ao final, entregue:
- arquivos criados;
- arquivos alterados;
- funcionalidades implementadas;
- testes executados;
- riscos;
- dívidas técnicas;
- próxima etapa;
- confirmação de custo zero;
- confirmação de que não adicionou IA paga;
- confirmação de que não adicionou coleta excessiva de dados.
```

---

# 26. Observação final

Este projeto deve ser tratado como software educacional com responsabilidade pedagógica.

A prioridade não é criar muitas funcionalidades. A prioridade é criar um ciclo completo e confiável:

```txt id="trvhuy"
código de acesso
→ mapa de missões
→ missão didática
→ questão
→ feedback
→ progresso
→ revisão dos erros
→ relatório
```

Somente após esse ciclo funcionar bem, o projeto deve evoluir para mais conteúdo, mais turmas, venda, automação de pagamento ou plataforma completa.
