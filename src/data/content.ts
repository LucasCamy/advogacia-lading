/**
 * Conteúdo DEMONSTRATIVO. Marca, nomes, números, currículos e contatos são fictícios.
 * Antes de publicar: substituir por dados reais e passar pela revisão legal (ver AGENTS.md).
 * Dados de identificação ausentes ficam como pendentes visíveis, nunca inventados.
 */
import type { MediaKey } from './media'

export const brand = {
  name: 'Varela & Montenegro',
  tagline: 'Advocacia Estratégica',
  city: 'São Paulo',
  descriptor: 'Atuação consultiva e contenciosa empresarial, patrimonial e societária',
}

export const PENDING = {
  cnpj: '[CNPJ: pendente]',
  oab: '[Registro da sociedade na OAB/SP: pendente]',
  razaoSocial: '[Razão social: pendente]',
  endereco: '[Endereço completo: pendente]',
  telefone: '[Telefone: pendente]',
  encarregado: '[Encarregado de dados: pendente]',
  atualizacao: '[Data de atualização: pendente]',
}

export const contactEmail = 'contato@varelamontenegro.example'

export type NavItem = { id: string; label: string }
export const navItems: NavItem[] = [
  { id: 'areas', label: 'Áreas' },
  { id: 'escritorio', label: 'Escritório' },
  { id: 'travessia', label: 'Travessia' },
  { id: 'metodo', label: 'Método' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'duvidas', label: 'Dúvidas' },
]

/** Capítulos na ordem do documento (indicador numérico de progresso). */
export const chapters: NavItem[] = [
  { id: 'inicio', label: 'Abertura' },
  { id: 'pilares', label: 'Pilares' },
  { id: 'escritorio', label: 'Escritório' },
  { id: 'areas', label: 'Áreas' },
  { id: 'travessia', label: 'Travessia' },
  { id: 'metodo', label: 'Método' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'duvidas', label: 'Dúvidas' },
  { id: 'contato', label: 'Contato' },
]

export const heroFronts = ['Consultivo', 'Contencioso', 'Societário', 'Patrimonial']

export type Pillar = { id: string; title: string; short: string; commitment: string[] }
export const pillars: Pillar[] = [
  {
    id: 'etica',
    title: 'Ética',
    short: 'Dizemos o que o caso permite, inclusive quando a resposta é não litigar.',
    commitment: [
      'Toda proposta informa riscos, custos prováveis e alternativas ao processo.',
      'Não prometemos resultado. Explicamos cenários com base na lei e na jurisprudência atual.',
      'Conflitos de interesse são checados antes da primeira reunião de mérito.',
    ],
  },
  {
    id: 'estrategia',
    title: 'Estratégia',
    short: 'Cada caso começa por um mapa: objetivo, prazo, custo e plano B.',
    commitment: [
      'O diagnóstico escrito chega em até 10 dias úteis após o recebimento dos documentos.',
      'A estratégia é revista a cada fato novo relevante, não só no fim de cada fase.',
      'Decisões de rumo são tomadas com você, registradas e datadas.',
    ],
  },
  {
    id: 'proximidade',
    title: 'Proximidade',
    short: 'Um sócio responde pelo seu caso, do primeiro contato ao encerramento.',
    commitment: [
      'Você sabe quem conduz o caso e fala com essa pessoa diretamente.',
      'Retorno em até 1 dia útil para mensagens sobre o andamento.',
      'Relatório de status mensal em linguagem clara, sem juridiquês.',
    ],
  },
  {
    id: 'sigilo',
    title: 'Sigilo',
    short: 'Informação do cliente circula só entre quem precisa dela para trabalhar.',
    commitment: [
      'Documentos sensíveis trafegam por canal cifrado, nunca por anexo comum.',
      'Acesso ao dossiê é restrito à equipe nomeada no caso.',
      'Sigilo profissional mantido também após o fim da relação.',
    ],
  },
]

export type Metric = { value: number; suffix: string; label: string; note: string }
export const metrics: Metric[] = [
  { value: 18, suffix: '+', label: 'Anos de atuação', note: 'desde 2008' },
  { value: 6, suffix: '', label: 'Áreas de atuação', note: 'consultivo e contencioso' },
  { value: 14, suffix: '', label: 'Advogados', note: 'equipe em 2026' },
  { value: 3, suffix: '', label: 'Idiomas', note: 'português, inglês, espanhol' },
]

export type Profile = 'todas' | 'empresas' | 'familia'
export const profiles: { id: Profile; label: string }[] = [
  { id: 'todas', label: 'Todas as Frentes' },
  { id: 'empresas', label: 'Empresas e Societário' },
  { id: 'familia', label: 'Família e Patrimônio' },
]

export type Area = {
  id: string
  index: string
  title: string
  summary: string
  profiles: Exclude<Profile, 'todas'>[]
  scope: string[]
  situations: string[]
  documents: string[]
}

export const areas: Area[] = [
  {
    id: 'empresarial',
    index: '01',
    title: 'Empresarial e Societário',
    summary: 'Estrutura, governança e conflitos entre sócios, da constituição à saída.',
    profiles: ['empresas'],
    scope: [
      'Constituição e reorganização de sociedades limitadas e anônimas fechadas',
      'Acordos de sócios e de acionistas, governança e conselhos',
      'Fusões, aquisições e due diligence',
      'Dissolução parcial, apuração de haveres e disputas societárias',
    ],
    situations: [
      'Entrada de um investidor e revisão do contrato social',
      'Sócio que quer sair e discorda do valor das quotas',
      'Empresa familiar que precisa separar gestão e propriedade',
    ],
    documents: ['Contrato ou estatuto social atualizado', 'Últimas alterações registradas na Junta', 'Acordo de sócios, se houver', 'Balanço do último exercício'],
  },
  {
    id: 'contratos',
    index: '02',
    title: 'Contratos',
    summary: 'Redação, revisão e negociação de contratos que sustentam a operação.',
    profiles: ['empresas'],
    scope: [
      'Contratos de fornecimento, distribuição e prestação de serviços',
      'Contratos de tecnologia, licenças e confidencialidade',
      'Negociação de cláusulas de risco, multa e limitação de responsabilidade',
      'Gestão de inadimplemento e renegociação',
    ],
    situations: [
      'Fornecedor estratégico descumprindo prazos de entrega',
      'Padronização de contratos para uma rede de clientes',
      'Revisão de minuta enviada por grande contraparte',
    ],
    documents: ['Contrato vigente ou minuta em negociação', 'Troca de e-mails relevante', 'Pedidos, notas e comprovantes de entrega'],
  },
  {
    id: 'trabalhista',
    index: '03',
    title: 'Trabalhista Empresarial',
    summary: 'Prevenção e defesa da empresa nas relações de trabalho.',
    profiles: ['empresas'],
    scope: [
      'Auditoria preventiva de práticas trabalhistas',
      'Defesa em reclamações trabalhistas e ações coletivas',
      'Negociação com sindicatos e acordos coletivos',
      'Políticas internas, compliance e investigações',
    ],
    situations: [
      'Reestruturação com desligamentos em grupo',
      'Contratação de prestadores e risco de vínculo',
      'Fiscalização ou notificação do Ministério do Trabalho',
    ],
    documents: ['Convenção ou acordo coletivo aplicável', 'Modelos de contrato de trabalho', 'Notificações ou petições recebidas'],
  },
  {
    id: 'tributario',
    index: '04',
    title: 'Tributário',
    summary: 'Planejamento lícito, defesa em autuações e recuperação de créditos.',
    profiles: ['empresas', 'familia'],
    scope: [
      'Planejamento tributário empresarial e patrimonial',
      'Defesa administrativa e judicial em autos de infração',
      'Revisão de enquadramento e recuperação de créditos',
      'Impactos da reforma tributária sobre a operação',
    ],
    situations: [
      'Auto de infração com prazo de impugnação correndo',
      'Holding familiar e tributação de rendimentos',
      'Avaliação do impacto do IBS e da CBS nos contratos',
    ],
    documents: ['Auto de infração ou notificação fiscal', 'Apurações dos últimos 12 meses', 'Organograma societário'],
  },
  {
    id: 'familia',
    index: '05',
    title: 'Família e Sucessões',
    summary: 'Planejamento sucessório, inventários e acordos familiares com discrição.',
    profiles: ['familia'],
    scope: [
      'Planejamento sucessório e holdings patrimoniais',
      'Testamentos, doações e pactos antenupciais',
      'Inventários judiciais e extrajudiciais',
      'Divórcios consensuais e litigiosos com patrimônio relevante',
    ],
    situations: [
      'Fundadores que querem organizar a sucessão da empresa',
      'Inventário com bens em mais de um estado',
      'Separação que envolve participação societária',
    ],
    documents: ['Certidões de casamento e de nascimento dos herdeiros', 'Relação de bens e participações', 'Testamento ou pacto, se houver'],
  },
  {
    id: 'imobiliario',
    index: '06',
    title: 'Imobiliário',
    summary: 'Compra, venda, locação e regularização de imóveis com segurança registral.',
    profiles: ['familia', 'empresas'],
    scope: [
      'Due diligence imobiliária e auditoria de matrícula',
      'Compra e venda, permuta e incorporação',
      'Locações comerciais, built to suit e renovatórias',
      'Regularização, usucapião e disputas possessórias',
    ],
    situations: [
      'Compra de imóvel comercial com pendências na matrícula',
      'Renovação de locação de loja em shopping',
      'Imóvel herdado sem inventário concluído',
    ],
    documents: ['Matrícula atualizada do imóvel', 'Contrato de locação ou compromisso de compra', 'IPTU e certidões do vendedor'],
  },
]

/** Imagem que acompanha cada linha do grid xadrez, na ordem das linhas. */
export const areaRowImages: MediaKey[] = ['corridor', 'contract', 'library']

export type Milestone = { index: string; title: string; text: string; at: number; frame: number }
/**
 * `at` = progresso (0..1) da cena em que a legenda entra; `frame` = quadro-chave do fallback.
 * Cenas da sequência: escadaria 1–39, contrato 49–79, sala de conselho 88–120 (40–48 e 80–87 são transições).
 */
export const milestones: Milestone[] = [
  { index: '01', title: 'Escuta', text: 'O caso chega com fatos, documentos e o que você quer preservar.', at: 0, frame: 1 },
  { index: '02', title: 'Leitura', text: 'Separamos o ruído do que decide: prazos, provas, riscos e quem tem poder de acordo.', at: 0.27, frame: 30 },
  { index: '03', title: 'Decisão', text: 'Você escolhe o caminho com cenários escritos e só assina o que entendeu.', at: 0.54, frame: 64 },
  { index: '04', title: 'Condução', text: 'Da mesa de reunião ao encerramento, com relatório a cada etapa e um sócio ao lado.', at: 0.8, frame: 110 },
]

export type Step = { index: string; title: string; text: string; duration: string; deliverable: string }
export const steps: Step[] = [
  { index: '01', title: 'Reunião Inicial', text: 'Uma conversa de 60 minutos para entender o contexto, o objetivo e a urgência.', duration: '60 min', deliverable: 'Lista de documentos e próximos passos' },
  { index: '02', title: 'Diagnóstico', text: 'Análise dos documentos e da jurisprudência aplicável, com riscos em ordem de impacto.', duration: 'até 10 dias úteis', deliverable: 'Parecer de diagnóstico escrito' },
  { index: '03', title: 'Estratégia e Proposta', text: 'Caminhos possíveis, custos estimados e cronograma. Nada começa sem a sua decisão.', duration: '3 dias úteis', deliverable: 'Proposta de honorários e plano de ação' },
  { index: '04', title: 'Acompanhamento', text: 'Execução com um sócio responsável, relatórios mensais e revisão a cada fato novo.', duration: 'até o encerramento', deliverable: 'Relatório mensal de status' },
]

export type Member = {
  id: string
  name: string
  role: string
  specialty: string
  photo: MediaKey
  oab: string
  bio: string[]
  education: string[]
  languages: string[]
  focus: string[]
}
export const team: Member[] = [
  {
    id: 'helena',
    name: 'Dra. Helena Varela',
    role: 'Sócia-fundadora',
    specialty: 'Societário, fusões e aquisições, governança',
    photo: 'team01',
    oab: '[OAB/SP: pendente]',
    bio: [
      'Fundou o escritório em 2008 depois de uma década em operações de fusões e aquisições.',
      'Conduz reorganizações societárias de empresas familiares e assessora conselhos de administração.',
      'Coordena a frente de governança e as negociações de entrada e saída de sócios.',
    ],
    education: ['Bacharel em Direito', 'Especialização em Direito Societário', 'Mestrado em Direito Comercial'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    focus: ['Acordos de sócios', 'M&A de médio porte', 'Sucessão em empresas familiares'],
  },
  {
    id: 'livia',
    name: 'Dra. Lívia Andrade',
    role: 'Sócia',
    specialty: 'Família, sucessões e planejamento patrimonial',
    photo: 'team02',
    oab: '[OAB/SP: pendente]',
    bio: [
      'Atua há 14 anos em planejamento sucessório, inventários e divórcios com patrimônio relevante.',
      'Estrutura holdings familiares em conjunto com a frente tributária.',
      'Mediadora formada, prioriza acordos que preservam a convivência da família.',
    ],
    education: ['Bacharel em Direito', 'Especialização em Direito de Família e Sucessões', 'Formação em Mediação de Conflitos'],
    languages: ['Português', 'Inglês'],
    focus: ['Holdings patrimoniais', 'Inventários extrajudiciais', 'Pactos antenupciais'],
  },
  {
    id: 'rafael',
    name: 'Dr. Rafael Montenegro',
    role: 'Sócio-fundador',
    specialty: 'Contencioso estratégico, contratos e tributário',
    photo: 'team03',
    oab: '[OAB/SP: pendente]',
    bio: [
      'Lidera o contencioso cível e tributário do escritório desde a fundação.',
      'Atua em disputas contratuais complexas e na defesa de autuações fiscais.',
      'Acompanha os impactos da reforma tributária sobre contratos de longo prazo.',
    ],
    education: ['Bacharel em Direito', 'Especialização em Direito Processual Civil', 'LL.M. em Direito Tributário'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    focus: ['Disputas contratuais', 'Defesa fiscal', 'Arbitragem'],
  },
]

export type Faq = { q: string; a: string[] }
export const faqs: Faq[] = [
  {
    q: 'A reunião inicial é cobrada?',
    a: [
      'A primeira conversa, de até 60 minutos, serve para entender o caso e dizer se podemos ajudar. As condições de honorários são apresentadas por escrito antes de qualquer trabalho de mérito.',
    ],
  },
  {
    q: 'Quais documentos devo levar?',
    a: [
      'Depende da área. Ao agendar, enviamos uma lista curta. Em geral: contratos, notificações recebidas, documentos societários e uma linha do tempo dos fatos.',
      'Não envie documentos sigilosos pelo formulário do site: compartilhamos um canal seguro depois do agendamento.',
    ],
  },
  {
    q: 'Vocês atendem fora de São Paulo?',
    a: ['Sim. Atendemos por vídeo em todo o Brasil e, quando o caso exige, com correspondentes locais acompanhados pela nossa equipe.'],
  },
  {
    q: 'Como são definidos os honorários?',
    a: [
      'Por escopo e complexidade, com referência na tabela da OAB/SP. Podem ser fixos por etapa, mensais para assessoria contínua ou combinados com êxito, sempre em contrato escrito.',
    ],
  },
  {
    q: 'Quanto tempo leva o diagnóstico?',
    a: ['Até 10 dias úteis depois do recebimento completo dos documentos. Casos com prazo correndo recebem prioridade e um primeiro retorno em 48 horas.'],
  },
  {
    q: 'Como o sigilo das informações é garantido?',
    a: [
      'O sigilo profissional é dever legal do advogado. Na prática: acesso restrito ao dossiê, troca de arquivos por canal cifrado e nenhum dado do caso em ferramentas sem contrato de confidencialidade.',
    ],
  },
]

export const office = {
  address: PENDING.endereco,
  neighborhood: 'Itaim Bibi · São Paulo · SP',
  hours: ['Segunda a sexta: 9h às 19h', 'Reuniões por vídeo: 8h às 20h'],
  email: contactEmail,
  phone: PENDING.telefone,
}
