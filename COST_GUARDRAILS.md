# COST_GUARDRAILS.md — Regras de custo zero

## Regra principal

Durante desenvolvimento, implantação e oferta inicial controlada, o software **não deve gerar custos financeiros** ao proprietário.

## Serviços permitidos (gratuitos)

| Serviço | Limite gratuito | Uso no projeto |
|---------|----------------|---------------|
| Supabase Free | 500 MB, 50k MAU | Banco Postgres |
| Vercel Hobby | Ilimitado (uso pessoal) | Deploy de desenvolvimento |
| Netlify Free | 100 GB bandwidth, 300 min/mês build | Deploy de oferta controlada |
| Cloudflare Pages | Ilimitado | Alternativa ao Netlify |
| GitHub Free | Privado/público | Repositório de código |

## Serviços proibidos no MVP

- OpenAI API, Anthropic API, Gemini API (qualquer API de IA paga)
- PlanetScale, Neon, Railway (bancos pagos)
- Auth0, Clerk, Firebase Auth (autenticação paga)
- Twilio, SendGrid, Resend (e-mail/SMS pago)
- Datadog, Sentry Pro (analytics/monitoring pago)
- Stripe, MercadoPago (gateway de pagamento)
- Qualquer domínio pago como requisito

## Como verificar uma dependência antes de adicionar

1. Acesse o site do serviço e confirme que existe plano gratuito permanente.
2. Verifique se o plano gratuito tem limites que o MVP pode ultrapassar.
3. Verifique se exige cartão de crédito (mesmo sem cobrar).
4. Se exigir cartão, não adicione sem decisão explícita do proprietário.
5. Registre a decisão em `DECISIONS.md`.

## Checklist antes de qualquer deploy

- [ ] Nenhuma variável de ambiente aponta para serviço pago
- [ ] Nenhuma dependência em `package.json` exige plano pago
- [ ] Supabase está no plano Free
- [ ] Vercel/Netlify está no plano gratuito
- [ ] Nenhuma API de IA é chamada pelo app
- [ ] Nenhum webhook ou scheduled job em serviço pago

## Alerta sobre Supabase Free

O Supabase Free pausa projetos inativos por mais de 7 dias.  
Durante o piloto, acesse o projeto regularmente para evitar pausa.  
Para produção contínua, avaliar upgrade para Pro ($25/mês) — apenas quando houver receita.
