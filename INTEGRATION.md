# Integração do recebimento

Estado atual: o frontend envia para a função Vercel `POST /api/diagnosticos` sem exigir nome legal, documento, e-mail de privacidade ou outros campos administrativos da política. A função valida e encaminha para o webhook somente quando `DIAGNOSTICS_ENABLED` é exatamente `true` e `WEBHOOK_URL` contém uma URL HTTPS válida. Campos não informados na política são apresentados como não informados; não são usados como trava técnica.

## Editar a página

- `dist/config.mjs`: nome, biografia, método, textos, perguntas, opções, contato e política.
- `dist/app.mjs`: componentes reutilizáveis, rotas, etapas, acessibilidade e comportamento.
- `dist/styles.css`: tokens e layouts responsivos.
- `dist/form-core.mjs`: normalização, validação e adaptador de envio.
- `/`, `/diagnostico` e `/privacidade` têm entradas HTML próprias e navegação interna.

As fotografias originais foram fornecidas pelo usuário. Não foram gerados depoimentos, números, reconhecimentos ou qualificações.

## Encaminhamento pelo n8n

Quando a pessoa clicar em enviar no fim do formulário, a função server-side valida e encaminha o payload JSON completo descrito abaixo ao webhook. O envio é feito uma vez no envio final, não a cada tecla. A função usa o mesmo endereço do site e mantém a URL do n8n fora do código público.

Configure na Vercel, em **Project → Settings → Environment Variables**:

- `WEBHOOK_URL`: URL **Production** do Webhook node do n8n, armazenada como variável **Secret**. Não usar a Test URL em produção nem colocar a URL no GitHub, em `dist/config.mjs` ou em variável `VITE_`/pública.
- `DIAGNOSTICS_ENABLED`: defina como `true` para habilitar o encaminhamento server-side. A função só encaminha quando o valor for exatamente `true`; a presença ou ausência de dados administrativos na política não altera essa regra técnica.

No workflow n8n, configure o Webhook node para `POST` e, se desejar, grave uma cópia no Supabase. Não é necessário um nó **Respond to Webhook** com JSON personalizado: qualquer resposta HTTP de sucesso (2xx, inclusive 204 ou 200 vazio) é aceita. Se o n8n devolver erro HTTP, não responder ou exceder o tempo limite, o formulário informará falha. O proxy encaminha o cabeçalho `Idempotency-Key`; configure deduplicação no workflow/destino usando essa chave se uma repetição não puder criar registros duplicados.

A função valida a origem da requisição, o formato e o tamanho do payload, os campos e opções permitidos, o consentimento obrigatório, e não registra o corpo com dados pessoais. Erros do webhook não são apresentados como recebimento bem-sucedido. O proxy não armazena os dados: o workflow n8n e o destino configurado passam a fazer parte do fluxo de tratamento e devem ser documentados na política.

## Ativar a captação

1. Criar e ativar o workflow n8n e usar a Production URL. O n8n pode responder com qualquer status 2xx; não é exigido corpo JSON especial.
2. Cadastrar `WEBHOOK_URL` como Secret na Vercel e `DIAGNOSTICS_ENABLED=true` no ambiente em que o recebimento deve ocorrer. Não colocar a URL secreta no GitHub.
3. Publicar/reimplantar o projeto após alterar variáveis de ambiente.
4. Antes de divulgar, testar uma submissão controlada de ponta a ponta e confirmar que chegou somente ao destino autorizado, sem dados pessoais em logs. Adicionar rate limiting e proteção antispam compatível com a acessibilidade na camada Vercel ou no n8n.
5. A função revalida no servidor os formatos, limites, opções permitidas, desafios (um a três), descrição obrigatória de “Outro”, consentimentos e campos inesperados. A faixa de faturamento e investimento é declarativa; nenhuma inferência de aderência é feita.
6. Manter no fluxo/destino a versão do aviso e os dois consentimentos separados. Definir deduplicação por `Idempotency-Key`, controle de acesso, retenção, eliminação e atendimento aos direitos do titular no sistema que persistir os dados.
7. Informações de privacidade incompletas não bloqueiam tecnicamente o envio. A política apresenta como não informados os dados que o operador ainda não forneceu; revise-a para descrever fielmente a operação real.

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
