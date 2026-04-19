import { useState, useMemo } from 'react'
import { RecorrenciaLead, RecorrenciaConfig } from '@/types/followup'
import { MOCK_RECORRENCIA_LEADS, MOCK_RECORRENCIA_CONFIGS } from '@/lib/mock-followup'

export function useRecorrencia() {
  const [leads, setLeads] = useState<RecorrenciaLead[]>(MOCK_RECORRENCIA_LEADS)
  const [configs, setConfigs] = useState<RecorrenciaConfig[]>(MOCK_RECORRENCIA_CONFIGS)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<string>('todos')

  const leadsFiltrados = useMemo(() => {
    return leads.filter(lead => {
      const matchesBusca = !busca || 
        lead.nome?.toLowerCase().includes(busca.toLowerCase()) || 
        lead.telefone.includes(busca)
      
      const matchesStatus = statusFiltro === 'todos' || lead.status === statusFiltro

      return matchesBusca && matchesStatus
    })
  }, [leads, busca, statusFiltro])

  const cancelarRecorrencia = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'cancelado' } : l))
  }

  const toggleConfigAtiva = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, ativo: !c.ativo } : c))
  }

  const salvarConfig = (config: Partial<RecorrenciaConfig>) => {
    if (config.id) {
      setConfigs(prev => prev.map(c => c.id === config.id ? { ...c, ...config } as RecorrenciaConfig : c))
    } else {
      const novaConfig: RecorrenciaConfig = {
        ...config,
        id: `conf_${Math.random().toString(36).substr(2, 9)}`,
        org_id: 'org_123',
        created_at: new Date().toISOString(),
      } as RecorrenciaConfig
      setConfigs(prev => [novaConfig, ...prev])
    }
  }

  const metricas = useMemo(() => {
    const totalConcluidos = leads.filter(l => l.status === 'concluido').length
    const totalReconvertidos = leads.filter(l => l.status === 'concluido').length // Simplificação: todos concluídos agendaram de novo no mock
    
    return {
      aguardando: leads.filter(l => l.status === 'aguardando').length,
      ativos: leads.filter(l => l.status === 'ativo').length,
      concluidos: totalConcluidos,
      taxaReconversao: totalConcluidos > 0 ? (totalReconvertidos / totalConcluidos) * 100 : 0,
      total: leads.length
    }
  }, [leads])

  return {
    leads: leadsFiltrados,
    configs,
    busca,
    setBusca,
    statusFiltro,
    setStatusFiltro,
    cancelarRecorrencia,
    toggleConfigAtiva,
    salvarConfig,
    metricas
  }
}
