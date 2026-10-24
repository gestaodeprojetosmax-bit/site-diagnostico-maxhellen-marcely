# Publicar na Vercel

O projeto está preparado como site estático. A configuração em `vercel.json` executa `npm test` antes do deploy e publica `dist/`, onde estão as páginas `/`, `/diagnostico` e `/privacidade`.

## Importar

1. No painel da Vercel, escolha **Add New → Project** e importe o repositório `site-diagnostico-maxhellen-marcely` do GitHub.
2. Mantenha o diretório raiz do projeto como `./` e o framework como **Other** (ou sem framework identificado).
3. Confirme o comando de build `npm test` e o diretório de saída `dist` indicados por `vercel.json`.
4. Importe o projeto e aguarde a conclusão do build. Os deploys seguintes serão acionados por pushes para o repositório.

## Antes de divulgar ou recolher respostas

- A versão atual é uma prévia: o questionário não envia nem guarda respostas. Não anunciar que houve envio ou receção de dados.
- A política de privacidade ainda contém campos entre parênteses retos, como identificação do responsável e contacto. Preencher e rever o texto para a operação real antes de divulgar o site.
- Para ativar captação, integrar e validar um endpoint seguro seguindo `INTEGRATION.md`; não incluir chaves, senhas ou URLs secretas no frontend ou no GitHub.
