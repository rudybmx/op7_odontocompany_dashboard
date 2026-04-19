import { NpsResposta, NpsConfigCompleta, calcularCategoria } from '@/types/nps'
import { MOCK_AGENDAS } from '@/lib/mock-agenda'
import { subDays, subHours, addHours } from 'date-fns'

const agendas = MOCK_AGENDAS
const [agRafael, agAna, agSala] = agendas

function daysAgo(d: number, h = 10): string {
  return subHours(subDays(new Date(), d), h).toISOString()
}
function respondido(enviado: string, minutos = 18): string {
  return addHours(new Date(enviado), minutos / 60).toISOString()
}

// ─── 30 Respostas NPS ─────────────────────────────────────────────────────────
// 15 promotores (9-10) + 8 neutros (7-8) + 7 detratores (0-6)

type RawNps = {
  id: string; ag_id: string; clienteNome: string; clienteTel: string
  score: number; feedback?: string; diasAtras: number
  canal: 'whatsapp' | 'email' | 'sms'; automatico: boolean
  acao?: string; acaoEm?: number // dias atrás
}

const RAW: RawNps[] = [
  // PROMOTORES (15) ───────────────────────────────────────────────────────────
  { id: 'nps-001', ag_id: agRafael.id, clienteNome: 'Fernanda Rodrigues',   clienteTel: '11987654321', score: 10, feedback: 'Atendimento excepcional! Dr. Rafael foi muito atencioso e explicou tudo com clareza. Me sinto muito bem cuidada.', diasAtras: 2,  canal: 'whatsapp', automatico: true },
  { id: 'nps-002', ag_id: agAna.id,    clienteNome: 'Carlos Eduardo Lima',   clienteTel: '11923456789', score: 9,  feedback: 'Profissionalismo de alto nível. A Dra. Ana é incrível, me deixou completamente à vontade durante o implante.', diasAtras: 4,  canal: 'whatsapp', automatico: true },
  { id: 'nps-003', ag_id: agRafael.id, clienteNome: 'Beatriz Alves Santos',  clienteTel: '21987654321', score: 10, feedback: 'Clínica impecável! Pontualidade, limpeza, simpatia da equipe. Nota 10 com folga!', diasAtras: 5,  canal: 'whatsapp', automatico: false },
  { id: 'nps-004', ag_id: agSala.id,   clienteNome: 'Thiago Mendonça',       clienteTel: '21912345678', score: 9,  feedback: 'Procedure went smoothly and the team was very supportive throughout.', diasAtras: 8,  canal: 'email',    automatico: true },
  { id: 'nps-005', ag_id: agAna.id,    clienteNome: 'Juliana Costa Ferreira',clienteTel: '31987654321', score: 10, feedback: 'Sempre indico a clínica para meus amigos. Nunca tive uma experiência ruim. A Dra. Ana é top!', diasAtras: 10, canal: 'whatsapp', automatico: true },
  { id: 'nps-006', ag_id: agRafael.id, clienteNome: 'Amanda Oliveira',       clienteTel: '41987654321', score: 9,  feedback: 'Fui com medo e saí muito satisfeita. Explica tudo antes de fazer, isso me ajuda demais.', diasAtras: 12, canal: 'whatsapp', automatico: true },
  { id: 'nps-007', ag_id: agSala.id,   clienteNome: 'Camila Ferraz',         clienteTel: '51923456789', score: 10, feedback: 'Espaço limpo, moderno e a equipe é super gentil. Estou muito feliz com o resultado.', diasAtras: 15, canal: 'whatsapp', automatico: false },
  { id: 'nps-008', ag_id: agAna.id,    clienteNome: 'Marcos Vinícius Carvalho', clienteTel: '61987654321', score: 9, feedback: 'Tratamento muito bem-feito, resultado acima das expectativas. Recomendo!', diasAtras: 18, canal: 'whatsapp', automatico: true },
  { id: 'nps-009', ag_id: agRafael.id, clienteNome: 'Larissa Nascimento',    clienteTel: '51987654321', score: 10, feedback: 'Pontual, profissional e humano. Exatamente o que eu procurava. Parabéns à equipe toda!', diasAtras: 20, canal: 'whatsapp', automatico: true },
  { id: 'nps-010', ag_id: agAna.id,    clienteNome: 'Priya Silva',           clienteTel: '61912345678', score: 9,  feedback: 'Muito satisfeita com o resultado do implante. A Dra. Ana passou segurança durante todo o procedimento.', diasAtras: 22, canal: 'email', automatico: false },
  { id: 'nps-011', ag_id: agSala.id,   clienteNome: 'Diego Borges',          clienteTel: '71987654321', score: 10, feedback: 'Excelente clínica. Fui com urgência e fui atendido rapidamente. Resultado perfeito!', diasAtras: 25, canal: 'whatsapp', automatico: true },
  { id: 'nps-012', ag_id: agRafael.id, clienteNome: 'Andressa Martins',      clienteTel: '71923456789', score: 9,  feedback: 'Atencioso, cuidadoso e eficiente. Não é fácil encontrar um profissional assim.', diasAtras: 30, canal: 'whatsapp', automatico: true },
  { id: 'nps-013', ag_id: agAna.id,    clienteNome: 'Roberto Faria',         clienteTel: '81987654321', score: 10, feedback: 'Melhor clínica que já fui. Atendimento humanizado do início ao fim.', diasAtras: 35, canal: 'whatsapp', automatico: true },
  { id: 'nps-014', ag_id: agSala.id,   clienteNome: 'Gustavo Pereira',       clienteTel: '11934567890', score: 9,  feedback: 'Super organizado. O agendamento foi rápido e o atendimento foi excelente!', diasAtras: 40, canal: 'whatsapp', automatico: false },
  { id: 'nps-015', ag_id: agRafael.id, clienteNome: 'Isabela Cunha',         clienteTel: '21945678901', score: 10, feedback: 'Voltarei com certeza e vou recomendar para toda a família. Perfeito!', diasAtras: 45, canal: 'whatsapp', automatico: true },

  // NEUTROS (8) ───────────────────────────────────────────────────────────────
  { id: 'nps-016', ag_id: agRafael.id, clienteNome: 'Paulo Henrique Dias',   clienteTel: '31923456789', score: 8,  feedback: 'Atendimento bom, mas a espera foi um pouco longa. No geral, ficou satisfeito.', diasAtras: 3,  canal: 'whatsapp', automatico: true },
  { id: 'nps-017', ag_id: agAna.id,    clienteNome: 'Renata Souza',          clienteTel: '41923456789', score: 7,  feedback: 'Gostei do atendimento, mas o espaço de espera poderia ser maior e mais confortável.', diasAtras: 6,  canal: 'whatsapp', automatico: true },
  { id: 'nps-018', ag_id: agSala.id,   clienteNome: 'Felipe Cardoso',        clienteTel: '51912345678', score: 8,  feedback: 'Profissionais competentes, mas senti falta de mais informações sobre o pós-procedimento.', diasAtras: 9,  canal: 'email',    automatico: false },
  { id: 'nps-019', ag_id: agRafael.id, clienteNome: 'Gabriela Torres',       clienteTel: '61923456789', score: 7,  feedback: 'Experiência positiva no geral. Acho que o sistema de confirmação de consulta pode melhorar.', diasAtras: 14, canal: 'whatsapp', automatico: true },
  { id: 'nps-020', ag_id: agAna.id,    clienteNome: 'Leonardo Nunes',        clienteTel: '71912345678', score: 8,  feedback: 'Bom atendimento. Sugiro melhorar a comunicação entre recepção e consultório.', diasAtras: 23, canal: 'whatsapp', automatico: true },
  { id: 'nps-021', ag_id: agSala.id,   clienteNome: 'Vanessa Lima',          clienteTel: '81923456789', score: 7,  feedback: 'Atendimento dentro do esperado. Achei que poderia ter mais opções de horário à tarde.', diasAtras: 32, canal: 'whatsapp', automatico: false },
  { id: 'nps-022', ag_id: agRafael.id, clienteNome: 'Henrique Bastos',       clienteTel: '11956789012', score: 8,  feedback: 'Boa experiência. O médico foi claro e preciso. A sala de espera estava um pouco lotada.', diasAtras: 42, canal: 'email',    automatico: true },
  { id: 'nps-023', ag_id: agAna.id,    clienteNome: 'Tatiana Moura',         clienteTel: '21956789012', score: 7,  feedback: 'Gostei do resultado mas senti que o pós-atendimento poderia ter mais suporte.', diasAtras: 55, canal: 'whatsapp', automatico: true },

  // DETRATORES (7) ────────────────────────────────────────────────────────────
  { id: 'nps-024', ag_id: agRafael.id, clienteNome: 'Marcelo Albuquerque',   clienteTel: '31912345678', score: 3,  feedback: 'Esperei mais de 1 hora além do horário marcado sem nenhuma explicação. Muito frustrado.', diasAtras: 1,  canal: 'whatsapp', automatico: true },
  { id: 'nps-025', ag_id: agAna.id,    clienteNome: 'Sandra Vieira',         clienteTel: '41912345678', score: 5,  feedback: 'Meu agendamento foi cancelado de última hora e tive dificuldade para remarcar. Decepcionante.', diasAtras: 7,  canal: 'whatsapp', automatico: false, acao: 'Entramos em contato com a paciente e reagendamos com prioridade. Oferta de desconto aplicada.', acaoEm: 6 },
  { id: 'nps-026', ag_id: agSala.id,   clienteNome: 'Breno Azevedo',         clienteTel: '51923456789', score: 2,  feedback: 'Fui mal informado sobre o procedimento e o valor cobrado foi diferente do orçado. Não volto.', diasAtras: 11, canal: 'whatsapp', automatico: true },
  { id: 'nps-027', ag_id: agRafael.id, clienteNome: 'Cristiane Lopes',       clienteTel: '61912345678', score: 4,  feedback: 'Atendimento inicial ok, mas o retorno não foi dado no prazo prometido. Falta de organização.', diasAtras: 16, canal: 'whatsapp', automatico: true, acao: 'Gestor ligou pessoalmente para a paciente. Retorno agendado com prioridade.', acaoEm: 15 },
  { id: 'nps-028', ag_id: agAna.id,    clienteNome: 'Rogério Pontes',        clienteTel: '71912345678', score: 1,  feedback: 'Experiência horrível. Dor durante o procedimento e a equipe não prestou atenção nas minhas reclamações.', diasAtras: 28, canal: 'sms', automatico: false, acao: 'Paciente contatado, desculpas formais transmitidas, sessão de ajuste agendada gratuitamente.', acaoEm: 26 },
  { id: 'nps-029', ag_id: agSala.id,   clienteNome: 'Elaine Carmo',          clienteTel: '81912345678', score: 6,  feedback: 'Demora excessiva na espera e recepcionista foi um pouco fria no atendimento. Pode melhorar.', diasAtras: 38, canal: 'whatsapp', automatico: true },
  { id: 'nps-030', ag_id: agRafael.id, clienteNome: 'Fábio Guimarães',       clienteTel: '11967890123', score: 0,  feedback: 'Cancelaram minha consulta por duas vezes sem aviso. Perdi dias de trabalho. Inadmissível.', diasAtras: 50, canal: 'whatsapp', automatico: false, acao: 'Situação escalada para gerência. Visita prioritária e isenção de taxa oferecidas.', acaoEm: 48 },
]

export const MOCK_NPS_RESPOSTAS: NpsResposta[] = RAW.map((r) => {
  const agenda = agendas.find(a => a.id === r.ag_id)!
  const enviado = daysAgo(r.diasAtras)
  return {
    id: r.id,
    agendamento_id: `ag-nps-${r.id}`,
    cliente_nome: r.clienteNome,
    cliente_telefone: r.clienteTel,
    agenda_id: r.ag_id,
    agenda,
    score: r.score,
    categoria: calcularCategoria(r.score),
    feedback_texto: r.feedback,
    enviado_em: enviado,
    respondido_em: respondido(enviado, 25 + Math.random() * 60),
    canal: r.canal,
    enviado_automaticamente: r.automatico,
    acao_tomada: r.acao,
    acao_tomada_em: r.acaoEm ? daysAgo(r.acaoEm) : undefined,
    acao_tomada_por: r.acao ? 'usr-gestor' : undefined,
  }
})

// ─── NPS Config completa ──────────────────────────────────────────────────────
export const MOCK_NPS_CONFIG_FULL: NpsConfigCompleta[] = [
  {
    id: 'npscfg-001',
    agenda_id: null,
    ativo: true,
    trigger: 'automatico',
    horas_apos_atendimento: 2,
    canal: 'whatsapp',
    mensagem_template:
      'Olá, {{nome}}! 😊 Obrigado por visitar nossa clínica em {{data}}. De 0 a 10, o quanto você nos indicaria para um amigo ou familiar? Responda com apenas o número. Sua opinião é muito importante para nós!',
    msg_promotor:
      'Que ótimo, {{nome}}! 🎉 Fico muito feliz que tenha gostado. Você toparia deixar um depoimento rapidinho? É só responder aqui mesmo com um texto curto sobre sua experiência. Nos ajuda muito!',
    msg_neutro:
      'Obrigado pelo feedback, {{nome}}! 🙏 Tem alguma sugestão específica para melhorarmos? Sua opinião é fundamental para evoluirmos sempre.',
    msg_detrator:
      'Sentimos muito pela sua experiência, {{nome}} 😔 Gostaríamos muito de entender melhor o que aconteceu e como podemos melhorar. Posso te ligar em breve para conversarmos?',
  },
]
