# Integração do recebimento

Estado atual: **não há backend de recebimento neste projeto**. O site é uma prévia privada. A interface informa isso antes do preenchimento e na conclusão. Nenhuma resposta é enviada, registrada, qualificada automaticamente ou persistida no navegador. O formulário mantém as respostas somente em memória durante a navegação interna.

## Editar a página

- `dist/config.mjs`: nome, biografia, método, textos, perguntas, opções, contato e política.
- `dist/app.mjs`: componentes reutilizáveis, rotas, etapas, acessibilidade e comportamento.
- `dist/styles.css`: tokens e layouts responsivos.
- `dist/form-core.mjs`: normalização, validação e adaptador de envio.
- `/`, `/diagnostico` e `/privacidade` têm entradas HTML próprias e navegação interna.

As fotografias originais foram fornecidas pelo usuário. Não foram gerados depoimentos, números, reconhecimentos ou qualificações.

## Ativar a captação

1. Preencher a identidade e os placeholders da política, documentar fornecedores e estabelecer prazos reais de conservação. Revisar os consentimentos e o conteúdo com o responsável pelo tratamento.
2. Implementar no backend escolhido um endpoint da mesma origem, por exemplo `POST /api/diagnosticos`. Em hospedagem estática, essa rota não existe: é necessário adicionar um Worker/backend/proxy da mesma origem. Não configure um caminho sem implementá-lo.
3. Revalidar TODOS os campos no servidor: formatos, limites, opções permitidas, desafios entre um e três, descrição de Outro e consentimento obrigatório. Não confiar na validação do navegador. Limitar tamanho do body e rejeitar campos inesperados. A faixa de faturamento e investimento é declarativa; nenhuma inferência de aderência é feita neste frontend.
4. Validar Origin/Content-Type, implementar rate limiting e proteção antispam compatível com a acessibilidade. Não expor segredos, credenciais de banco, chaves ou URL privada de webhook no frontend. Não registrar o corpo com dados pessoais em logs de diagnóstico.
5. Persistir com acesso restrito e conexão segura. Guardar também data/hora do servidor, versão do aviso de privacidade e as escolhas separadas de consentimento. Implementar eliminação conforme a retenção definida, acesso para a equipe e atendimento aos direitos do titular.
6. Tratar `Idempotency-Key` de forma atômica para evitar duplicação caso o servidor persista e a resposta se perca. A chave é mantida durante tentativas na mesma sessão. Mesmo conteúdo/chave: devolver o comprovante existente; chave reutilizada com payload diferente: tratar no backend com política explícita (ex.: 409 e revisão da solicitação).
7. Só após gravar com sucesso retornar JSON com `accepted: true` e `submissionId` não vazio. HTTP 200 genérico, HTML de fallback e `{success:true}` não são interpretados como recebimento.
8. Preencher `site.integration.endpoint` e definir `privacyReady: true` somente quando tudo estiver configurado. O frontend exige também e-mail de contato e placeholders principais preenchidos. Revalidar a entrega real antes de abrir o acesso ao público. Remover `noindex` somente quando a página final estiver pronta.

## Contrato de requisição

```http
POST /api/diagnosticos
Content-Type: application/json
Accept: application/json
Idempotency-Key: <identificador aleatório>
```

```json
{
  "schemaVersion": 1,
  "source": "diagnostico-empresarial",
  "contact": {
    "fullName": "Pessoa de Exemplo",
    "company": "Empresa de Exemplo",
    "website": null,
    "whatsapp": "+5585999991234",
    "email": "exemplo@example.com",
    "location": null
  },
  "business": {
    "revenue": "Mais de R$ 30 mil até R$ 80 mil",
    "segment": "Prestação de serviços",
    "salesTeam": "1 a 2"
  },
  "challenges": ["Vender mais com previsibilidade"],
  "otherChallenge": null,
  "priority90Days": null,
  "readiness": {
    "timing": "Nos próximos 30 dias",
    "investment": "R$ 5 mil a R$ 15 mil",
    "decision": "Sou o decisor principal"
  },
  "consent": { "diagnostic": true, "marketing": false, "privacyVersion": "<versão vigente>" }
}
```

Sucesso real, após persistência:

```json
{ "accepted": true, "submissionId": "<id persistido>" }
```

Falhas suportadas: 400/422 (validação), 429 (muitas tentativas), demais erros HTTP, JSON inválido, timeout e indisponibilidade de rede. A interface mantém respostas na memória para revisão/tentativa, bloqueia cliques repetidos durante o envio e nunca afirma sucesso em erro. O servidor decide sobre aderência fora deste fluxo; não há calendário nem aprovação automática.

## Verificar

`npm test` executa os testes sem dependências externas. Os testes usam transportes isolados em memória e não enviam dados a serviços. Verificar também o fluxo completo no navegador, as rotas acessadas diretamente, teclado, erros, retorno de etapas, limite de escolhas, consentimento opcional e a apresentação móvel.

Privacidade: conteúdo editável orientado pelo briefing e pela [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm). O site não contém uma declaração de conformidade jurídica. Fontes servidas localmente; sem analytics, pixel ou integrações de terceiros nesta versão.
