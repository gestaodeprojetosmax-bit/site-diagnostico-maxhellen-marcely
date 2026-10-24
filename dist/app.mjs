import { site, steps, options, questions, processSteps } from './config.mjs';
import { blankAnswers, formatPhone, validateStep, integrationReady, submitDiagnostic, createRequestId } from './form-core.mjs';

const root = document.querySelector('#app');
const ready = integrationReady(site);
const state = { answers: blankAnswers(), step: 0, errors: {}, submitting: false, complete: null, requestId: createRequestId() };
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const icons = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
  note: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
};
const icon = (name, cls='') => `<svg class="icon ${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.arrow}</svg>`;
const mark = () => '<svg class="brand-mark" viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="M7 33V16a14 14 0 0 1 28 0v17M14 33V16a7 7 0 0 1 14 0v17M7 27h28" stroke="currentColor" stroke-width="1.3"/></svg>';
const cta = (classes='') => `<a class="button button-gold ${classes}" href="/diagnostico">${esc(site.copy.cta)}${icon('arrow')}</a>`;

function header(isHome=false) {
  return `<a href="#conteudo" class="skip-link">Pular para o conteúdo</a>
    <header class="site-header"><div class="container header-inner">
      <a class="brand" href="/" aria-label="${esc(site.specialist.name)} — Página inicial">${mark()}<span><span class="brand-name">${esc(site.specialist.name)}</span><span class="brand-caption">${esc(site.specialist.role)}</span></span></a>
      ${isHome ? `<nav class="desktop-nav" aria-label="Navegação principal"><a href="/#como-funciona">Como funciona</a><a href="/#especialista">A especialista</a></nav><a class="button button-gold header-cta" href="/diagnostico">${esc(site.copy.cta)}${icon('arrow')}</a>` : '<a class="back-link" href="/">' + icon('back') + '<span>Voltar ao início</span></a>'}
    </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container footer-inner"><a class="footer-brand" href="/">${esc(site.specialist.name)}<span>Estratégia para o próximo capítulo.</span></a><div class="footer-legal"><p>© 2026 ${esc(site.specialist.name)}. Todos os direitos reservados.</p><a href="/privacidade" target="_blank" rel="noopener">Política de privacidade<span class="sr-only"> (abre em uma nova aba)</span></a></div></div>${!ready ? '<div class="container preview-footer">Versão de apresentação. O recebimento de respostas ainda não está ativo.</div>' : ''}</footer>`;
}

function landing() {
  document.title = `Diagnóstico empresarial | ${site.specialist.name}`;
  return `${header(true)}<main id="conteudo" tabindex="-1">
    <section class="hero container" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow"><span></span>DIAGNÓSTICO EMPRESARIAL</p>
        <h1 id="hero-title">${esc(site.copy.headline)}</h1>
        <p class="hero-description">${esc(site.copy.subheadline)}</p>
        <div class="hero-action">${cta()}<p class="microcopy">${esc(site.copy.microcopy)}</p></div>
        <a href="#como-funciona" class="explore-link"><span class="explore-line"></span>Entenda como funciona</a>
      </div>
      <figure class="hero-visual"><div class="portrait-frame"><img class="hero-portrait" src="${esc(site.specialist.heroImage)}" alt="Retrato profissional da especialista, sorrindo, com roupa clara" width="854" height="1280" fetchpriority="high"><div class="portrait-shade"></div><div class="portrait-arch" aria-hidden="true"></div><figcaption><span>${esc(site.specialist.name)}</span><small>${esc(site.specialist.role)}</small></figcaption></div><div class="portrait-side" aria-hidden="true">Um olhar estratégico sobre o seu negócio</div></figure>
    </section>
    <section class="areas" aria-label="Áreas de atuação"><div class="container areas-inner"><span>O negócio, por inteiro.</span><ul><li>Vendas</li><li>Equipe</li><li>Processos</li><li>Posicionamento</li><li>Crescimento</li></ul></div></section>
    <section id="como-funciona" class="process-section container" aria-labelledby="process-title">
      <div class="section-heading"><div><p class="section-kicker">Clareza antes de qualquer decisão</p><h2 id="process-title">Como funciona</h2></div><p>O primeiro passo é entender onde você está.<br>O próximo, avaliar como podemos caminhar juntos.</p></div>
      <ol class="process-list">${processSteps.map((s,i)=>`<li><div class="step-number"><span>0${i+1}</span>${i<2 ? '<span class="step-line" aria-hidden="true"></span>' : icon('compass')}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
      <div class="process-note">${icon('info')}<p>O questionário é uma avaliação inicial de aderência. Ele não gera um diagnóstico automático nem garante uma consultoria.</p></div>
    </section>
    <section id="especialista" class="about-section" aria-labelledby="about-title"><div class="container about-layout">
      <div class="about-top"><div class="about-portraits">
        <figure class="about-photo about-photo-event"><img src="${esc(site.specialist.aboutImage)}" alt="Maxhellen falando em um evento" width="720" height="1280" loading="lazy"></figure>
        <figure class="about-photo about-photo-studio"><img src="${esc(site.specialist.aboutPortrait)}" alt="Retrato profissional de Maxhellen" width="854" height="1280" loading="lazy"></figure>
      </div><div class="about-copy"><p class="section-kicker">QUEM CONDUZ</p><h2 id="about-title">${esc(site.specialist.name)}</h2><p class="editable-copy">${esc(site.specialist.biography)}</p><div class="about-method-block"><p class="method-label">${esc(site.method.name)}</p><p class="about-method">${esc(site.method.description)}</p></div></div></div>
      <figure class="about-group-photo"><img src="${esc(site.specialist.groupImage)}" alt="Fotografia de grupo em um evento presencial" width="1280" height="720" loading="lazy"></figure>
    </div></section>
    <section class="final-section container" aria-labelledby="final-title"><div class="final-panel"><div class="final-symbol" aria-hidden="true">${mark()}</div><p class="section-kicker">Seu próximo capítulo começa com clareza</p><h2 id="final-title">Antes de crescer mais, <br>entenda o que precisa mudar.</h2><p>Compartilhe o momento da sua empresa. <br>Vamos avaliar se uma conversa estratégica faz sentido.</p>${cta()}<small>Para empresas em operação e com faturamento recorrente.</small></div></section>
  </main>${footer()}`;
}

const labels = { fullName:'Nome completo', company:'Nome da empresa', website:'Instagram profissional ou site', whatsapp:'WhatsApp com DDD', email:'E-mail', location:'Cidade e estado', otherChallenge:'Qual é o outro desafio?', problem:'Se pudéssemos resolver um problema importante na sua empresa nos próximos 90 dias, qual seria?', consent:'Consentimento para tratamento dos dados' };

function field(name, {required=false, type='text', placeholder='', autocomplete='', hint='', wide=false, textarea=false, maxLength=200}={}) {
  const err = state.errors[name];
  const described = `${hint ? `${name}-hint ` : ''}${name}-error`;
  const attrs = `id="${name}" name="${name}" ${required ? 'required' : ''} aria-invalid="${Boolean(err)}" aria-describedby="${described}" maxlength="${maxLength}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} placeholder="${esc(placeholder)}"`;
  return `<div class="field ${wide ? 'field-wide' : ''}"><label for="${name}">${esc(labels[name])} ${required ? '<span class="required" aria-hidden="true">*</span>' : '<span class="optional">(opcional)</span>'}</label>${textarea ? `<textarea ${attrs} rows="4">${esc(state.answers[name])}</textarea>` : `<input ${attrs} type="${type}" ${type === 'tel' ? 'inputmode="tel"' : type === 'email' ? 'inputmode="email" autocapitalize="none" spellcheck="false"' : ''} value="${esc(state.answers[name])}">`}${hint ? `<p class="field-hint" id="${name}-hint">${esc(hint)}</p>` : ''}<p class="field-error" id="${name}-error" ${err ? '' : 'hidden'}>${esc(err)}</p></div>`;
}

function choices(name, multiple=false) {
  const err = state.errors[name];
  const selected = multiple ? state.answers[name] : [state.answers[name]];
  return `<fieldset class="choice-group" id="group-${name}" aria-describedby="${name}-error${multiple ? ' challenges-count' : ''}" ${err ? 'aria-invalid="true"' : ''}><legend>${esc(questions[name])} <span class="required" aria-hidden="true">*</span><span class="sr-only"> (obrigatório${multiple ? ', selecione até três opções' : ''})</span></legend>${multiple ? `<p id="challenges-count" class="choice-count" role="status">${selected.length} de 3 selecionados${selected.length===3 ? ". Para escolher outra opção, desmarque uma das selecionadas." : ""}</p>` : ''}<div class="choice-grid">${options[name].map((opt,i)=>`<label class="choice ${selected.includes(opt) ? 'is-selected' : ''}"><input type="${multiple ? 'checkbox' : 'radio'}" id="${name}-${i}" name="${name}" value="${esc(opt)}" ${selected.includes(opt) ? 'checked' : ''} ${multiple && selected.length>=3 && !selected.includes(opt) ? 'disabled' : ''} ${multiple ? '' : 'required'} aria-describedby="${name}-error"><span class="choice-indicator ${multiple ? 'square' : ''}" aria-hidden="true">${multiple ? icon('check') : ''}</span><span>${esc(opt)}</span></label>`).join('')}</div><p class="field-error" id="${name}-error" ${err ? '' : 'hidden'}>${esc(err)}</p></fieldset>`;
}

function stepContent() {
  switch(state.step) {
    case 0: return `<div class="fields-grid">${field('fullName',{required:true,autocomplete:'name',placeholder:'Seu nome e sobrenome'})}${field('company',{required:true,autocomplete:'organization',placeholder:'Como sua empresa se chama?'})}${field('website',{placeholder:'@suaempresa ou www.suaempresa.com.br',wide:true})}${field('whatsapp',{required:true,type:'tel',autocomplete:'tel-national',placeholder:'(00) 00000-0000',maxLength:25})}${field('email',{required:true,type:'email',autocomplete:'email',placeholder:'voce@empresa.com.br'})}${field('location',{placeholder:'Ex.: Fortaleza, CE',wide:true,autocomplete:'address-level2'})}</div>`;
    case 1: return ['revenue','segment','team'].map(n=>choices(n)).join('');
    case 2: return `${choices('challenges',true)}<div id="other-challenge" ${state.answers.challenges.includes('Outro') ? '' : 'hidden'}>${field('otherChallenge',{required:true,placeholder:'Conte brevemente qual é o desafio',maxLength:500})}</div>${field('problem',{textarea:true,maxLength:1500,hint:'Até 1.500 caracteres. Não inclua dados de clientes, pacientes ou informações sensíveis.',placeholder:'Compartilhe o que faria diferença para o seu negócio...'})}`;
    case 3: return `${['timing','investment','decision'].map(n=>choices(n)).join('')}<div class="consents"><label class="consent-row"><input type="checkbox" id="consent" name="consent" required ${state.answers.consent?'checked':''} aria-invalid="${Boolean(state.errors.consent)}" aria-describedby="consent-error"><span>Autorizo o tratamento dos meus dados para analisar esta solicitação e entrar em contato sobre uma possível conversa estratégica, conforme a <a href="/privacidade" target="_blank" rel="noopener">Política de privacidade<span class="sr-only"> (abre em uma nova aba)</span></a>. <span class="required" aria-hidden="true">*</span></span></label><p class="field-error" id="consent-error" ${state.errors.consent?'':'hidden'}>${esc(state.errors.consent)}</p><label class="consent-row optional-consent"><input type="checkbox" id="marketing" name="marketing" ${state.answers.marketing?'checked':''}><span>Quero receber conteúdos e comunicações promocionais. <span class="optional">(opcional)</span></span></label><p class="field-hint">A escolha de receber conteúdos não interfere na análise da sua solicitação.</p></div>`;
  }
}

function errorSummary() {
  const entries = Object.entries(state.errors);
  return `<div class="error-summary" id="error-summary" tabindex="-1" role="alert" ${entries.length?'':'hidden'}><strong>Confira os campos abaixo para continuar.</strong><ul>${entries.map(([key,msg])=>`<li><a href="#${options[key] ? key+'-0' : key}">${esc(labels[key] ?? questions[key])}: ${esc(msg)}</a></li>`).join('')}</ul></div>`;
}

function sidebar() {
  return `<aside class="form-sidebar"><a href="/" class="back-link sidebar-back">${icon('back')}Voltar ao início</a><p class="section-kicker">Diagnóstico empresarial</p><h2>O primeiro passo é olhar para o seu negócio.</h2><p>Reserve um momento para responder com calma. Queremos entender o que faz sentido para você.</p><ol class="form-step-list">${steps.map((s,i)=>`<li class="${i===state.step?'current':i<state.step?'done':''}" ${i===state.step?'aria-current="step"':''}><span class="step-dot">${i<state.step?icon('check'):i+1}</span><span>${esc(s.label)}</span></li>`).join('')}</ol><div class="sidebar-note">${icon('lock')}<p>Suas informações serão usadas para avaliar a aderência e orientar o próximo contato.</p></div></aside>`;
}

function diagnostic() {
  document.title = `Diagnóstico — Etapa ${state.step+1} de 4 | ${site.specialist.name}`;
  if(state.complete) return completePage();
  return `${header()}<main id="conteudo" class="container form-layout" tabindex="-1">${sidebar()}<section class="form-panel" aria-labelledby="form-title">
    <div class="progress-meta"><span>Etapa ${state.step+1} de 4</span><span>${esc(steps[state.step].label)}</span></div><progress max="4" value="${state.step+1}" aria-label="Progresso do questionário: etapa ${state.step+1} de 4">${state.step+1} de 4</progress>
    ${!ready ? `<div class="preview-notice">${icon('info')}<p><strong>Prévia • envio indisponível</strong>Você pode conhecer o questionário. As respostas não serão enviadas. A integração de recebimento precisa ser configurada antes de abrir a captação.</p></div>` : ''}
    <div class="form-heading"><h1 id="form-title" tabindex="-1">${esc(steps[state.step].title)}</h1><p>${esc(steps[state.step].description)}</p></div>
    <form id="diagnostic-form" novalidate>${errorSummary()}${stepContent()}<div class="submit-error" id="submit-error" role="alert" tabindex="-1" hidden></div><div class="form-actions"><button type="button" class="button button-quiet" id="previous" ${state.step===0?'disabled':''}>${icon('back')}Voltar</button><button class="button button-gold" type="submit" id="next">${state.step===3 ? (ready?'Enviar para análise':'Concluir prévia') : 'Avançar'}${icon('arrow')}</button></div><p class="form-footnote">${state.step===3 ? (ready?'O envio não garante consultoria, agendamento ou resultados.':'Modo de apresentação. Ao concluir, nenhum dado será enviado.') : 'Você pode voltar e revisar suas respostas antes de concluir.'}</p></form>
  </section></main>${footer()}`;
}

function completePage() {
  const preview = state.complete === 'preview';
  document.title = `${preview?'Prévia concluída':'Respostas recebidas'} | ${site.specialist.name}`;
  return `${header()}<main id="conteudo" class="completion-wrap container" tabindex="-1"><section class="completion-panel"><div class="completion-icon">${icon(preview?'note':'check')}</div><p class="section-kicker">${preview?'Modo de apresentação':'Solicitação recebida'}</p><h1 tabindex="-1">${preview?'Você chegou ao fim da prévia.':'Obrigado por compartilhar o seu momento.'}</h1><p class="completion-lead">${preview?'Suas respostas não foram enviadas nem salvas em um servidor.':'O recebimento das suas respostas foi confirmado. A equipe avaliará as informações e a aderência ao trabalho.'}</p><div class="next-steps"><h2>${preview?'Como será o próximo passo':'E agora?'}</h2><p>${preview?'Quando o recebimento estiver ativo, a equipe poderá analisar as respostas. Se houver aderência, você receberá instruções para agendar uma conversa estratégica pelos contatos informados.':'Se houver aderência, você receberá instruções para agendar uma conversa estratégica pelo WhatsApp ou e-mail informado.'}</p><p>O preenchimento não gera um diagnóstico automático e não garante consultoria, agendamento ou resultados.</p></div>${preview?'<div class="preview-notice"><p><strong>Captação ainda indisponível.</strong> A integração de envio e os dados da política de privacidade precisam ser finalizados antes de receber solicitações.</p></div><button class="button button-gold" id="review">Revisar minhas respostas'+icon('back')+'</button><button class="text-link clear-button" id="clear">Encerrar e limpar respostas</button>':'<a class="button button-gold" href="/">Voltar ao início'+icon('arrow')+'</a>'}</section></main>${footer()}`;
}

function privacy() {
  document.title = `Política de privacidade | ${site.specialist.name}`;
  const p = site.privacy;
  const contact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contactEmail) ? `<a href="mailto:${esc(p.contactEmail)}">${esc(p.contactEmail)}</a>` : '<span class="placeholder-text">[E-MAIL DE CONTATO PARA PRIVACIDADE — PREENCHER]</span>';
  return `${header()}<main id="conteudo" class="container privacy-layout" tabindex="-1"><aside class="privacy-aside"><p class="section-kicker">Transparência e cuidado</p><nav aria-label="Conteúdo da política"><a href="#responsavel">Responsável e contato</a><a href="#dados">Dados e finalidade</a><a href="#compartilhamento">Compartilhamento</a><a href="#conservacao">Conservação</a><a href="#direitos">Seus direitos</a></nav></aside><article class="privacy-article"><h1>Política de privacidade</h1><p class="policy-date">Última atualização: ${esc(p.updatedAt)}</p>${!ready?'<div class="preview-notice">'+icon('info')+'<p><strong>Minuta editável • captação inativa</strong>Responsável, contato, fornecedores e prazos devem ser preenchidos antes da ativação. Esta versão não envia as respostas do questionário.</p></div>':''}
    <section id="responsavel"><h2>1. Responsável e contato</h2><p>O responsável pelo tratamento dos dados desta solicitação é <span class="placeholder-text">${esc(p.controller)}</span>, documento <span class="placeholder-text">${esc(p.document)}</span>.</p><p>Para dúvidas sobre privacidade ou solicitações relacionadas aos seus dados, entre em contato por: ${contact}.</p></section>
    <section id="dados"><h2>2. Quais dados são solicitados</h2><p>O questionário solicita nome, empresa, WhatsApp, e-mail, faixa de faturamento, segmento, tamanho da equipe comercial, desafios, momento e faixa de investimento, participação na decisão e suas escolhas de consentimento. Instagram ou site, cidade e estado e o relato sobre os próximos 90 dias são opcionais.</p><p>Não inclua dados de pacientes, clientes, documentos pessoais ou outras informações sensíveis nos campos abertos.</p><h2>3. Para que serão usados</h2><p>Após a ativação do recebimento, as informações serão usadas para analisar o momento da empresa, avaliar a aderência ao trabalho e entrar em contato a respeito de uma possível conversa estratégica. O questionário não oferece diagnóstico automático nem decisão automática de aprovação.</p><p>O consentimento para esta análise é solicitado separadamente da autorização opcional para conteúdos promocionais. A opção promocional começa desmarcada e sua recusa não impede a solicitação de análise.</p></section>
    <section id="compartilhamento"><h2>4. Acesso e compartilhamento</h2><p>Antes de ativar o recebimento, o responsável deverá informar os fornecedores que participarão do tratamento, suas finalidades e eventuais transferências internacionais: <span class="placeholder-text">${esc(p.processors)}</span>.</p><p>O acesso às respostas deverá ser restrito às pessoas e aos fornecedores necessários à análise e ao contato. Requisições legais de autoridades competentes serão tratadas conforme a legislação aplicável.</p></section>
    <section id="conservacao"><h2>5. Prazo de conservação</h2><p>Respostas do diagnóstico: <span class="placeholder-text">${esc(p.retention)}</span>.</p><p>Dados para comunicações opcionais: <span class="placeholder-text">${esc(p.marketingRetention)}</span>. Você poderá solicitar a revogação da autorização para essas comunicações.</p><p>Ao término da finalidade ou do prazo definido, os dados deverão ser eliminados ou anonimizados, salvo hipóteses legais de conservação. O responsável deverá aplicar esses critérios também aos seus fornecedores.</p></section>
    <section id="direitos"><h2>6. Seus direitos</h2><p>Conforme a LGPD e as condições aplicáveis, você pode solicitar confirmação do tratamento, acesso, correção, informações sobre compartilhamento, anonimização, bloqueio ou eliminação de dados tratados inadequadamente, portabilidade quando aplicável e revogação do consentimento. Também pode apresentar uma petição à ANPD.</p><p>Faça sua solicitação pelo contato indicado acima. Poderá ser necessária uma confirmação de identidade proporcional à solicitação, para proteger suas informações.</p></section>
    <section><h2>7. Navegador e infraestrutura</h2><p>As respostas ficam apenas na memória desta página durante o preenchimento. O aplicativo não grava essas respostas em cookies, localStorage ou sessionStorage. Recarregar ou fechar a página pode apagar o que foi preenchido.</p><p>Esta página não incorpora ferramentas de publicidade ou análise de navegação. A infraestrutura de hospedagem e, em uma prévia privada, o serviço de autenticação podem tratar dados técnicos necessários ao acesso e à segurança conforme suas próprias políticas.</p><h2>8. Atualizações</h2><p>Esta política deve acompanhar o funcionamento real do serviço. Alterações serão publicadas nesta rota, com a respectiva data e versão.</p><p class="policy-source">Referência: <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer">Lei Geral de Proteção de Dados Pessoais (LGPD)</a>.</p></section>
    <a class="text-link" href="/">${icon('back')}Voltar à página inicial</a></article></main>${footer()}`;
}

let revealObserver;
function setupMotion(path) {
  revealObserver?.disconnect();
  if (path !== '/' || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elements = document.querySelectorAll('.process-section .section-heading, .process-list, .about-portraits, .about-copy, .about-group-photo, .final-panel');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0.08 });
  revealObserver = observer;
  elements.forEach(element => { element.classList.add('reveal-on-scroll'); observer.observe(element); });
}

function render({ focus=false }={}) {
  const path = location.pathname.replace(/\/$/,'') || '/';
  root.innerHTML = path === '/diagnostico' ? diagnostic() : path === '/privacidade' ? privacy() : path === '/' ? landing() : `${header()}<main id="conteudo" class="completion-wrap container"><h1>Página não encontrada</h1><p>Volte à página inicial para continuar.</p><a class="button button-gold" href="/">Página inicial</a></main>${footer()}`;
  document.body.dataset.route = path;
  setupMotion(path);
  if (path === '/diagnostico' && !state.complete) bindForm();
  document.querySelector('#review')?.addEventListener('click',()=>{ state.complete=null; state.step=3; state.errors={}; render({focus:true}); });
  document.querySelector('#clear')?.addEventListener('click',()=>{ state.answers=blankAnswers(); state.complete=null; state.step=0; state.errors={}; state.requestId=createRequestId(); navigate('/'); });
  if(focus) { window.scrollTo({top:0,behavior:'instant'}); const heading=document.querySelector('#form-title') ?? document.querySelector('h1') ?? document.querySelector('main'); heading?.setAttribute('tabindex','-1'); heading?.focus({preventScroll:true}); }
}

function showErrorSummary() {
  const node = document.querySelector('#error-summary');
  node.outerHTML = errorSummary();
  document.querySelector('#error-summary')?.focus();
}

function clearFieldError(name) {
  if (!state.errors[name]) return;
  if(validateStep(state.step,state.answers)[name]) return;
  delete state.errors[name];
  const err = document.getElementById(`${name}-error`); if(err){err.hidden=true;err.textContent='';}
  document.querySelectorAll(`[name="${name}"]`).forEach(el=>el.setAttribute('aria-invalid','false'));
  document.getElementById(`group-${name}`)?.removeAttribute('aria-invalid');
  const sum=document.querySelector('#error-summary'); if(sum) sum.outerHTML=errorSummary();
}

function bindForm() {
  const form = document.querySelector('#diagnostic-form');
  form.addEventListener('input', event=>{
    const el=event.target; const name=el.name;
    if(!(name in state.answers) || el.type==='radio' || el.type==='checkbox')return;
    if(name==='whatsapp'){
      const caret=el.selectionStart, atEnd=caret===el.value.length;
      const digitsBefore=el.value.slice(0,caret).replace(/\D/g,'').length;
      el.value=formatPhone(el.value);
      if(!atEnd){ let pos=0,seen=0; while(pos<el.value.length && seen<digitsBefore){if(/\d/.test(el.value[pos]))seen++;pos++;}el.setSelectionRange(pos,pos); }
    }
    state.answers[name]=el.value; clearFieldError(name);
  });
  form.addEventListener('change', event=>{
    const el=event.target; const name=el.name;
    if(!(name in state.answers))return;
    if(name==='challenges'){
      const checked=[...form.querySelectorAll('[name="challenges"]:checked')];
      if(checked.length>3){el.checked=false;return;}
      state.answers.challenges=checked.map(x=>x.value);
      form.querySelectorAll('[name="challenges"]').forEach(input=>{input.disabled=checked.length>=3&&!input.checked;input.closest('.choice').classList.toggle('is-selected',input.checked);});
      document.querySelector('#challenges-count').textContent=`${checked.length} de 3 selecionados${checked.length===3 ? '. Para escolher outra opção, desmarque uma das selecionadas.' : ''}`;
      const other=state.answers.challenges.includes('Outro');
      document.querySelector('#other-challenge').hidden=!other;
      document.querySelector('#otherChallenge').disabled=!other;
      if(!other){state.answers.otherChallenge='';document.querySelector('#otherChallenge').value='';clearFieldError('otherChallenge');}
    }else if(el.type==='checkbox'){state.answers[name]=el.checked;}
    else if(el.type==='radio'){
      state.answers[name]=el.value;
      form.querySelectorAll(`[name="${name}"]`).forEach(input=>input.closest('.choice').classList.toggle('is-selected',input.checked));
    }else state.answers[name]=el.value;
    clearFieldError(name);
  });
  document.querySelector('#previous').addEventListener('click',()=>{ if(state.step>0&&!state.submitting) history.back(); });
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(state.submitting)return;
    state.errors=validateStep(state.step,state.answers);
    if(Object.keys(state.errors).length){render();showErrorSummary();return;}
    if(state.step<3){state.step++;history.pushState({step:state.step},'',location.pathname);render({focus:true});return;}
    for(let i=0;i<4;i++){const errors=validateStep(i,state.answers);if(Object.keys(errors).length){state.step=i;state.errors=errors;render();showErrorSummary();return;}}
    if(!ready){state.complete='preview';render({focus:true});return;}
    state.submitting=true;
    form.setAttribute('aria-busy','true');
    const controls=[...form.querySelectorAll('input,textarea,button')];controls.forEach(c=>c.disabled=true);
    document.querySelector('#next').innerHTML='<span class="spinner" aria-hidden="true"></span>Enviando…';
    document.querySelector('#submit-error').hidden=true;
    try{
      await submitDiagnostic(state.answers,site,state.requestId);
      state.answers=blankAnswers();state.errors={};state.complete='submitted';render({focus:true});
    }catch(error){
      controls.forEach(c=>c.disabled=false);form.removeAttribute('aria-busy');
      document.querySelector('#next').innerHTML='Enviar para análise'+icon('arrow');
      const errorBox=document.querySelector('#submit-error');errorBox.textContent=error.message;errorBox.hidden=false;errorBox.focus();
    }finally{state.submitting=false;}
  });
}

function navigate(path) { history.pushState(path === '/diagnostico' ? {step:state.step} : {},'',path); render({focus:true}); }
document.addEventListener('click',event=>{
  const a=event.target.closest('a');
  if(!a || a.target==='_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button!==0)return;
  const url=new URL(a.href,location.origin);
  if(url.origin!==location.origin)return;
  if(url.pathname===location.pathname && url.hash)return;
  if(!['/','/diagnostico','/privacidade'].includes(url.pathname))return;
  event.preventDefault();navigate(url.pathname);
  if(url.hash){history.replaceState({},'',url.pathname+url.hash);document.querySelector(url.hash)?.scrollIntoView({behavior:'instant'});}
});
window.addEventListener('popstate',event=>{
  if(location.pathname === '/diagnostico' && !state.submitting){
    state.step = Number.isInteger(event.state?.step) && event.state.step >= 0 && event.state.step < 4 ? event.state.step : 0;
    state.complete = null;
    state.errors = {};
  }
  render({focus:true});
});
render();
