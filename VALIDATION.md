# Verificação desta entrega

- 19 testes de regras e integração aprovados em `npm test`.
- Fluxo completo percorrido no navegador: obrigatórios, máscara de telefone, retorno às etapas com respostas preservadas, escolhas de negócio preservadas, limite de 3 desafios, descrição de Outro, consentimento obrigatório, consentimento promocional desmarcado e conclusão da prévia sem alegar recebimento.
- Rotas de início, diagnóstico e privacidade renderizadas diretamente.
- Revisão visual de desktop e de páginas móveis em iframes de 390 px.
- Sem transbordamento horizontal nas três páginas a 375 px úteis; landing também verificada a 305, 753 e 1009 px úteis (frames de 320, 768 e 1024 px com barras de rolagem).
- Foco direcionado ao título da etapa ou ao resumo de erros; controles nativos; suporte a movimento reduzido no CSS; sem armazenamento de respostas em cookies/localStorage/sessionStorage.
- Limitação explícita: não há backend configurado. Recebimento real e fluxo comercial de agendamento dependem da integração descrita em INTEGRATION.md.
