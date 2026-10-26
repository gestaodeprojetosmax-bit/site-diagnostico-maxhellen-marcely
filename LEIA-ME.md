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

## Envio do formulário

O formulário envia as respostas finais para a rota same-origin `/api/diagnosticos`. A função Vercel valida os dados e encaminha para a URL guardada na variável secreta `WEBHOOK_URL`; `DIAGNOSTICS_ENABLED=true` precisa estar configurada no ambiente do deployment. O frontend não exige nome legal, documento, e-mail de privacidade nem campos administrativos para chamar a rota. Se o endpoint, a ativação ou o webhook estiverem incorretos, o formulário informa falha e não confirma recebimento. Nunca grave a URL secreta no frontend ou no GitHub.

A página de privacidade informa com transparência os dados que ainda não foram fornecidos pelo operador; esses dados não são utilizados como trava técnica de envio. Revise o texto para refletir o fluxo real e o canal de atendimento antes de divulgar amplamente.
