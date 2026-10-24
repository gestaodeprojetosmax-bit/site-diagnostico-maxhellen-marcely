// Edite a identidade, os textos e as opções neste arquivo.
// Não coloque chaves, senhas ou URLs secretas de webhooks no frontend.
export const site = {
  specialist: {
    name: 'Maxhellen Marcely',
    role: 'Empresária e mentora de negócios',
    biography: 'Empresária e mentora de negócios, Maxhellen conduz empresas que já faturam a destravar o próximo nível de crescimento — com estrutura comercial, processos e estratégia, sem que tudo dependa do dono.',
    heroImage: '/assets/especialista-retrato.jpeg',
    aboutImage: '/assets/especialista-evento.jpeg',
    aboutPortrait: '/assets/especialista-retrato.jpeg',
    groupImage: '/assets/grupo-evento.jpeg',
  },
  method: {
    name: 'Método VOAR',
    description: 'Um caminho estruturado para empresários que querem crescer com previsibilidade, equipe e indicadores.',
  },
  copy: {
    headline: 'A sua empresa já fatura. Está preparada para crescer sem depender de você?',
    subheadline: 'Responda a algumas perguntas para identificarmos os principais desafios do seu negócio e avaliarmos se uma conversa estratégica faz sentido.',
    cta: 'Quero meu diagnóstico',
    microcopy: 'Questionário rápido. Se houver aderência, você poderá conversar com a nossa equipe.',
  },
  privacy: {
    version: 'rascunho-2026-10-23',
    updatedAt: '23 de outubro de 2026',
    controller: '[NOME / RAZÃO SOCIAL DO RESPONSÁVEL]',
    document: '[CPF OU CNPJ DO RESPONSÁVEL]',
    contactEmail: '', // Preencher com um e-mail real antes de ativar a captação.
    retention: '[DEFINIR PRAZO OU CRITÉRIO DE CONSERVAÇÃO DAS RESPOSTAS]',
    marketingRetention: '[DEFINIR PRAZO OU CRITÉRIO DE CONSERVAÇÃO PARA COMUNICAÇÕES]',
    processors: '[INFORMAR FORNECEDORES, FINALIDADES E EVENTUAIS TRANSFERÊNCIAS INTERNACIONAIS]',
  },
  integration: {
    // INTEGRAÇÃO PENDENTE: este projeto não possui backend de recebimento.
    // Endpoint deve ser da mesma origem, validado no servidor e sem segredos públicos.
    // Contrato completo em INTEGRATION.md. Sucesso só após confirmação real do servidor.
    endpoint: '', // Exemplo após implementar: '/api/diagnosticos'
    privacyReady: false, // Só ativar após preencher e revisar a política e o contato.
    timeoutMs: 15000,
  },
};

export const processSteps = [
  { title: 'Você responde', text: 'Um questionário sobre o momento e os principais desafios da sua empresa.' },
  { title: 'Nós analisamos', text: 'Avaliamos suas respostas e a aderência ao nosso trabalho.' },
  { title: 'Próximo passo', text: 'Se houver aderência, você recebe instruções para agendar uma conversa estratégica.' },
];

export const steps = [
  { label: 'Identificação', title: 'Vamos conhecer sua empresa.', description: 'Comece com seus dados de contato. Os campos com * são obrigatórios.' },
  { label: 'Momento do negócio', title: 'Em que momento sua empresa está?', description: 'Essas informações nos ajudam a entender o contexto do seu negócio.' },
  { label: 'Principal desafio', title: 'O que precisa mudar primeiro?', description: 'Escolha até três desafios que mais impactam a sua empresa hoje.' },
  { label: 'Momento de contratação', title: 'Vamos entender o próximo passo.', description: 'Queremos avaliar se o momento e as expectativas estão alinhados.' },
];

export const options = {
  revenue: ['Até R$ 30 mil', 'Mais de R$ 30 mil até R$ 80 mil', 'Mais de R$ 80 mil até R$ 150 mil', 'Mais de R$ 150 mil até R$ 300 mil', 'Mais de R$ 300 mil até R$ 500 mil', 'Acima de R$ 500 mil'],
  segment: ['Clínica ou saúde', 'Mentoria, educação ou infoprodutos', 'Imobiliário', 'Eventos presenciais', 'Prestação de serviços', 'Outro'],
  team: ['Não tenho equipe', '1 a 2', '3 a 5', '6 a 10', 'Mais de 10'],
  challenges: ['Vender mais com previsibilidade', 'Melhorar a performance comercial', 'Construir ou reorganizar equipe', 'Atrair clientes de maior ticket', 'Melhorar posicionamento e autoridade', 'Crescer sem depender exclusivamente do dono', 'Melhorar processos e indicadores', 'Aumentar lucratividade', 'Estruturar vendas de eventos presenciais', 'Outro'],
  timing: ['Imediatamente', 'Nos próximos 30 dias', 'Nos próximos 90 dias', 'Estou pesquisando possibilidades'],
  investment: ['Até R$ 5 mil', 'R$ 5 mil a R$ 15 mil', 'R$ 15 mil a R$ 30 mil', 'R$ 30 mil a R$ 50 mil', 'Acima de R$ 50 mil', 'Preciso entender a proposta'],
  decision: ['Sou o decisor principal', 'Decido com sócios', 'Participo da avaliação', 'Não sou responsável pela contratação'],
};

export const questions = {
  revenue: 'Qual é o faturamento médio mensal da sua empresa?',
  segment: 'Qual é o seu segmento?',
  team: 'Quantas pessoas trabalham no seu comercial?',
  challenges: 'Qual é o maior desafio da sua empresa atualmente?',
  timing: 'Quando pretende investir na melhoria da sua empresa?',
  investment: 'Qual faixa de investimento considera viável para um projeto estratégico, caso exista aderência à sua necessidade?',
  decision: 'Você participa da decisão de contratação?',
};
