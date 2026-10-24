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

Antes de publicar para captação: ainda não há backend para receber respostas. O questionário funciona como prévia e não envia nem salva dados. A política de privacidade também contém campos por preencher. Complete esses itens antes de divulgar o site; não inclua segredos no frontend.
