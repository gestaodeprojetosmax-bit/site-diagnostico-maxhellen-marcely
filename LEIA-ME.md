# Site de diagnóstico empresarial — Maxhellen Marcely

Este pacote contém a landing page, o questionário em quatro etapas, a política de privacidade, fotografias e o código editável.

## Visualizar

A pasta `dist/` é o site pronto para hospedagem estática. Publique o conteúdo dessa pasta em um servidor HTTPS com suporte às rotas `/`, `/diagnostico` e `/privacidade`. Para uma prévia local, execute `python -m http.server 8000 -d dist` e abra `http://localhost:8000`.

## Editar

- `dist/config.mjs`: identidade, textos, perguntas, opções e configuração.
- `dist/styles.css`: aparência e responsividade.
- `dist/app.mjs`: telas e navegação.
- `INTEGRATION.md`: contrato e instruções para conectar o backend.
- `npm test`: testes do formulário.

## Vercel

O projeto inclui `vercel.json` para executar os testes (`npm test`) e publicar `dist/`. Consulte [`VERCEL.md`](VERCEL.md) para importar o repositório e concluir a configuração.

## Estado da captação

O endpoint Vercel `/api/diagnosticos` está preparado para encaminhar o JSON do formulário a um webhook n8n, mas permanece bloqueado: ainda não há `WEBHOOK_URL` configurada e a política tem campos por preencher. O formulário não envia dados até a integração e a política serem configuradas. Siga [`INTEGRATION.md`](INTEGRATION.md); nunca grave a URL secreta do webhook no frontend ou no GitHub.
