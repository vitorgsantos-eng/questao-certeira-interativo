# Original User Request

## Initial Request — 2026-06-17T03:20:46Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Wait for the teamwork_preview multi-agent system to complete its execution

Implementar e testar funcionalidades remanescentes (responsividade em mobile) e sanar dívidas técnicas de segurança (vulnerabilidades) do MVP (Questão Certeira Interativo), com base estrita nos documentos de governança, limitando-se ao que não exige banco de dados remoto provisionado.

Working directory: c:\Users\VITOR\Documents\Projetos\Questao_Certeira_Interativo
Integrity mode: benchmark

## Requirements

### R1. Assinatura Criptográfica da Sessão
Resolver a dívida técnica (`SECURITY.md`) implementando assinatura HMAC usando a variável `SESSION_SECRET` no cookie `qci_session` (ou substituindo por JWT leve), garantindo que sessões em base64 não possam ser forjadas no lado do cliente.

### R2. Proteção contra Força Bruta (Rate Limiting)
Resolver a dívida técnica de segurança adicionando "Rate Limiting" nas rotas de validação de código de acesso (`/api/auth/validate-code`), limitando tentativas por IP usando uma estrutura de dados em memória simples.

### R3. Verificação Estrita de Expiração
Implementar a regra (marcada como pendente em `CHECKLISTS.md`) onde a sessão atual verifica ativamente se o prazo do código de acesso do aluno já expirou.

### R4. Homologação Funcional Mobile
Finalizar as pendências do "Checklist de teste no celular": Garantir legibilidade do Mapa de Missões em tela pequena, área de toque funcional nas questões de múltipla escolha, acionamento correto do teclado numérico (`inputMode="decimal"`) nos campos apropriados e responsividade na tela de relatórios.

## Acceptance Criteria

### Segurança e Autenticação
- [ ] Um script automatizado ou suite de testes comprova que sessões adulteradas (HMAC inválido) são rejeitadas com erro de autenticação.
- [ ] Um script ou teste comprova que requisições rápidas excessivas à rota de validação de códigos recebem status HTTP 429 (Too Many Requests).
- [ ] Um script comprova que uma sessão com data de expiração no passado bloqueia o acesso e não carrega conteúdo pedagógico.

### Interface Mobile
- [ ] Inpeções do código (via `npm run lint`, `type-check` or script de verificação visual) garantem a existência de utilitários como `max-w-full`, classes flex/grid responsivas e o atributo `inputMode="decimal"` nos campos `NumericQuestion.tsx`.
