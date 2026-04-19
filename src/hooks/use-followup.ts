import { useState, useMemo } from 'react'
import { FiltrosFollowup, FollowupLead, LeadStatusFechamento, LeadTemperatura } from '@/types/followup'
import { MOCK_FOLLOWUP_LEADS } from '@/lib/mock-followup'

export function useFollowup() {
  const [leads, setLeads] = useState<FollowupLead[]>(MOCK_FOLLOWUP_LEADS)

  const listarLeads = (filtros: FiltrosFollowup) => {
    return leads.filter(lead => {
      const matchStatus = filtros.status === 'todos' || lead.status_followup === filtros.status
      const matchFechamento = filtros.status_fechamento === 'todos' || lead.status_fechamento === filtros.status_fechamento
      const matchTemperatura = filtros.temperatura === 'todos' || lead.temperatura === filtros.temperatura
      const matchOrigem = filtros.origem === 'todos' || lead.origem === filtros.origem
      const matchBusca = !filtros.busca || 
        lead.nome?.toLowerCase().includes(filtros.busca.toLowerCase()) || 
        lead.telefone.includes(filtros.busca)
      
      // Proximo envio range logic
      let matchEnvio = true
      if (filtros.proximo_envio_range !== 'todos') {
        const hoje = new Date().toISOString().split('T')[0]
        if (filtros.proximo_envio_range === 'hoje') {
          matchEnvio = lead.proximo_envio?.startsWith(hoje) || false
        } else if (filtros.proximo_envio_range === 'atrasados') {
          matchEnvio = (lead.proximo_envio && lead.proximo_envio < hoje) || false
        }
      }

      return matchStatus && matchFechamento && matchTemperatura && matchOrigem && matchBusca && matchEnvio
    })
  }

  const getLead = (id: string) => leads.find(l => l.id === id)

  const atualizarStatusFechamento = (id: string, status: LeadStatusFechamento) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status_fechamento: status } : l))
  }

  const atualizarTemperatura = (id: string, temperatura: LeadTemperatura) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, temperatura } : l))
  }

  const pausarLead = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status_followup: 'pausado' } : l))
  }

  const reativarLead = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status_followup: 'ativo' } : l))
  }

  const metricas = useMemo(() => {
    const total = leads.length
    const ganhos = leads.filter(l => l.status_fechamento === 'ganho').length
    return {
      ativos: leads.filter(l => l.status_followup === 'ativo').length,
      vencidos: leads.filter(l => l.status_followup === 'vencido').length,
      esgotados: leads.filter(l => l.status_followup === 'esgotado').length,
      ganhos,
      percas: leads.filter(l => l.status_fechamento === 'perca').length,
      total,
      taxa_conversao: total > 0 ? (ganhos / total) * 100 : 0,
      responderam: leads.filter(l => l.status_followup === 'respondeu').length
    }
  }, [leads])

  return {
    leads,
    listarLeads,
    getLead,
    atualizarStatusFechamento,
    atualizarTemperatura,
    pausarLead,
    reativarLead,
    metricas
  }
}
