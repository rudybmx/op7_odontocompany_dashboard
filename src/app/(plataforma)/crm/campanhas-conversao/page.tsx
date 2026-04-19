'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, Calendar as CalendarIcon, Download } from 'lucide-react'
import { useCampanhasConversao } from '@/hooks/use-campanhas-conversao'
import { CampanhasKpis } from '@/components/campanhas/campanhas-kpis'
import { GraficoPlataformas, FunilConversao } from '@/components/campanhas/campanhas-graficos'
import { CampanhasTabela } from '@/components/campanhas/campanhas-tabela'
import { CampanhasPainelLeads } from '@/components/campanhas/campanhas-painel-leads'
import { CampanhasModalCadastro } from '@/components/campanhas/campanhas-modal-cadastro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CampanhaMetrics } from '@/types/campanhas'
import { FollowupLead } from '@/types/followup'

export default function CampanhasConversaoPage() {
  const { listarCampanhas, metricasGerais, getLeadsDaCampanha } = useCampanhasConversao()
  
  const [filtros, setFiltros] = useState({
    plataforma: 'todas',
    periodo: 'atual',
    busca: ''
  })

  // Estados para modais e painéis
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [painelLeadsAberto, setPainelLeadsAberto] = useState(false)
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<CampanhaMetrics | null>(null)
  const [leadsDaCampanha, setLeadsDaCampanha] = useState<FollowupLead[]>([])

  const campanhas = listarCampanhas(filtros as any)

  // Dados agregados para gráficos
  const dataPlataformas = useMemo(() => {
    const plats = ['Meta', 'Google', 'LinkedIn', 'TikTok', 'WhatsApp', 'Offline']
    return plats.map(p => ({
      plataforma: p,
      leads: campanhas.filter(c => c.plataforma.toLowerCase() === p.toLowerCase()).reduce((acc, c) => acc + c.total_leads, 0),
      ganhos: campanhas.filter(c => c.plataforma.toLowerCase() === p.toLowerCase()).reduce((acc, c) => acc + c.leads_ganhos, 0)
    })).sort((a, b) => b.leads - a.leads).slice(0, 5)
  }, [campanhas])

  const funnelSteps = [
    { label: 'Leads Recebidos', value: metricasGerais.totalLeads, percent: 100 },
    { label: 'Responderam', value: Math.floor(metricasGerais.totalLeads * 0.7), percent: 70 },
    { label: 'Agendaram', value: Math.floor(metricasGerais.totalLeads * 0.45), percent: 45 },
    { label: 'Compareceram', value: Math.floor(metricasGerais.totalLeads * 0.3), percent: 30 },
    { label: 'Ganhos', value: Math.floor(metricasGerais.totalLeads * (metricasGerais.mediaConversao / 100)), percent: Math.floor(metricasGerais.mediaConversao) }
  ]

  const handleVerLeads = (campanha: CampanhaMetrics) => {
    setCampanhaSelecionada(campanha)
    setLeadsDaCampanha(getLeadsDaCampanha(campanha.campanha_nome))
    setPainelLeadsAberto(true)
  }

  return (
    <div style={{ background: 'var(--ws-page-bg)', minHeight: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ws-text-1)] tracking-tight">Conversão de Campanhas</h1>
          <p className="text-sm text-[var(--ws-text-2)]">Rastreie o caminho completo do lead: do clique ao fechamento</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white gap-2 h-10">
            <Download size={16} /> Exportar BI
          </Button>
          <button 
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold shadow-[0_4px_16px_rgba(62,91,255,0.35)] transition-all hover:scale-[1.02]"
            style={{ 
              background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
              border: 'none',
              fontSize: '14px'
            }}
          >
            <Plus size={18} /> Nova Campanha
          </button>
        </div>
      </div>

      {/* Container da toolbar de filtros */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}>

        {/* Busca */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
          <Search size={13} style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--ws-text-3)',
          }} />
          <input
            placeholder="Buscar campanha ou UTM..."
            value={filtros.busca}
            onChange={e => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
            style={{
              width: '100%',
              paddingLeft: 32, paddingRight: 12,
              paddingTop: 8, paddingBottom: 8,
              background: 'var(--ws-glass-bg)',
              border: '1px solid var(--ws-glass-border)',
              borderRadius: 'var(--ws-radius-md)',
              backdropFilter: 'blur(8px)',
              color: 'var(--ws-text-1)',
              fontSize: 12,
              outline: 'none',
            }}
          />
        </div>

        {/* Select de Plataforma — com opções visíveis */}
        <select
          value={filtros.plataforma}
          onChange={e => setFiltros(prev => ({ ...prev, plataforma: e.target.value }))}
          style={{
            padding: '8px 14px',
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-md)',
            backdropFilter: 'blur(8px)',
            color: 'var(--ws-text-1)',
            fontSize: 12,
            outline: 'none',
            cursor: 'pointer',
            minWidth: 160,
          }}
        >
          <option value="todas">Todas as plataformas</option>
          <option value="meta">Meta (Facebook/Instagram)</option>
          <option value="google">Google Ads</option>
          <option value="linkedin">LinkedIn Ads</option>
          <option value="tiktok">TikTok Ads</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="offline">Offline</option>
          <option value="organico">Orgânico</option>
        </select>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Botão período */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px',
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-md)',
          backdropFilter: 'blur(8px)',
          color: 'var(--ws-text-2)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <CalendarIcon size={13} />
          ABRIL 2026
        </button>

        {/* Botão filtros */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px',
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-md)',
          backdropFilter: 'blur(8px)',
          color: 'var(--ws-text-2)',
          fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <Filter size={13} />
          Filtros
        </button>
      </div>

      {/* KPIs */}
      <CampanhasKpis metrics={metricasGerais} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <GraficoPlataformas data={dataPlataformas} />
        <FunilConversao steps={funnelSteps} />
      </div>

      {/* Main Table */}
      <CampanhasTabela 
        campanhas={campanhas} 
        onVerLeads={handleVerLeads} 
      />

      {/* Modals & Panels */}
      <CampanhasModalCadastro 
        isOpen={modalNovoAberto} 
        onClose={() => setModalNovoAberto(false)} 
        onSave={(d) => console.log('Novo:', d)} 
      />

      <CampanhasPainelLeads 
        isOpen={painelLeadsAberto} 
        onClose={() => setPainelLeadsAberto(false)}
        campanha={campanhaSelecionada}
        leads={leadsDaCampanha}
      />
    </div>
  )
}
