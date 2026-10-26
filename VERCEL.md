# Publicar na Vercel

O projeto está preparado como site estático. A configuração em `vercel.json` executa `npm test` antes do deploy e publica `dist/`, onde estão as páginas `/`, `/diagnostico` e `/privacidade`.

## Importar

1. No painel da Vercel, escolha **Add New → Project** e importe o repositório `site-diagnostico-maxhellen-marcely` do GitHub.
2. Mantenha o diretório raiz do projeto como `./` e o framework como **Other** (ou sem framework identificado).
3. Confirme o comando de build `npm test` e o diretório de saída `dist` indicados por `vercel.json`.
4. Importe o projeto e aguarde a conclusão do build. Os deploys seguintes serão acionados por pushes para o repositório.

## Encaminhar ao n8n e guardar no Supabase

1. Na Vercel, abra **Project → Settings → Environment Variables** e adicione `WEBHOOK_URL` como variável **Secret**, com a **Production URL** do Webhook node do n8n. Não coloque essa URL no código nem no GitHub.
2. Defina `DIAGNOSTICS_ENABLED` como `true` no ambiente que deve receber os envios. O endpoint `/api/diagnosticos` só encaminha quando essa variável for exatamente `true` e `WEBHOOK_URL` for uma URL HTTPS válida.
3. No workflow n8n, receba o JSON por `POST`, grave uma cópia no Supabase e configure **Respond to Webhook** depois da gravação. Responda `application/json` com `{"accepted":true,"submissionId":"<id-gravado>"}`; sem esse recibo o site não apresenta sucesso.
4. O proxy Vercel encaminha os dados e não os armazena. Mantenha o Supabase como destino/backup dentro do workflow n8n e trate `Idempotency-Key` para reduzir duplicatas em tentativas repetidas.

## Antes de divulgar ou recolher respostas

- A interface envia para a rota same-origin sem exigir nome legal, documento, e-mail de privacidade ou outros campos administrativos da política. Isso não comprova que o webhook recebeu e persistiu os dados.
- Campos da política que o operador não forneceu são exibidos como informações não especificadas; a página não deve apresentar valores inventados. Revise-a para descrever fielmente o fluxo real.
- Não anunciar que houve recebimento antes de testar o fluxo completo. Consulte [`INTEGRATION.md`](INTEGRATION.md) e nunca inclua chaves, senhas ou URLs secretas no frontend ou no GitHub.
