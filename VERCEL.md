# Publicar na Vercel

O projeto está preparado como site estático. A configuração em `vercel.json` executa `npm test` antes do deploy e publica `dist/`, onde estão as páginas `/`, `/diagnostico` e `/privacidade`.

## Importar

1. No painel da Vercel, escolha **Add New → Project** e importe o repositório `site-diagnostico-maxhellen-marcely` do GitHub.
2. Mantenha o diretório raiz do projeto como `./` e o framework como **Other** (ou sem framework identificado).
3. Confirme o comando de build `npm test` e o diretório de saída `dist` indicados por `vercel.json`.
4. Importe o projeto e aguarde a conclusão do build. Os deploys seguintes serão acionados por pushes para o repositório.

## Encaminhar ao n8n e guardar no Supabase

1. Na Vercel, abra **Project → Settings → Environment Variables** e adicione `WEBHOOK_URL` como variável **Secret**, com a **Production URL** do Webhook node do n8n. Não coloque essa URL no código nem no GitHub.
2. Mantenha `DIAGNOSTICS_ENABLED` ausente ou diferente de `true` enquanto a política estiver incompleta. O endpoint `/api/diagnosticos` só encaminha quando essa variável for exatamente `true`.
3. No workflow n8n, receba o JSON por `POST`, grave uma cópia no Supabase e configure **Respond to Webhook** depois da gravação. Responda `application/json` com `{"accepted":true,"submissionId":"<id-gravado>"}`; sem esse recibo o site não apresenta sucesso.
4. O proxy Vercel encaminha os dados e não os armazena. Mantenha o Supabase como destino/backup dentro do workflow n8n e trate `Idempotency-Key` para reduzir duplicatas em tentativas repetidas.

## Antes de divulgar ou recolher respostas

- O endpoint está preparado, mas o envio permanece bloqueado até configurar `WEBHOOK_URL`, ativar o workflow n8n e definir `DIAGNOSTICS_ENABLED=true`. Não anunciar que houve envio ou receção de dados antes de testar o fluxo completo.
- A política de privacidade ainda contém campos entre parênteses retos, como identificação do responsável e contacto. Preencher e rever o texto para a operação real antes de divulgar o site.
- Para ativar captação, preencher a política e seguir [`INTEGRATION.md`](INTEGRATION.md). Não incluir chaves, senhas ou URLs secretas no frontend ou no GitHub.
