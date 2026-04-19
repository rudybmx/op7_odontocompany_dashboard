'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, RefreshCw, Layers } from 'lucide-react'
import { useRecorrencia } from '@/hooks/use-recorrencia'
import { RecorrenciaKpis } from '@/components/recorrencia/recorrencia-kpis'
import { RecorrenciaLista } from '@/components/recorrencia/recorrencia-lista'
import { RecorrenciaConfigCards } from '@/components/recorrencia/recorrencia-config-cards'
import { RecorrenciaPainel } from '@/components/recorrencia/recorrencia-painel'
import { RecorrenciaPainelLead } from '@/components/recorrencia/recorrencia-painel-lead'
import { Input } from '@/components/ui/input'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RecorrenciaConfig, RecorrenciaLead } from '@/types/followup'

export default function RecorrenciaPage() {
  const { 
    leads, 
    configs, 
    metricas, 
    busca, 
    setBusca, 
    statusFiltro, 
    setStatusFiltro,
    toggleConfigAtiva,
    salvarConfig
  } = useRecorrencia()

  const [abaAtiva, setAbaAtiva] = useState('leads')
  const [painelAberto, setPainelAberto] = useState(false)
  const [configEditada, setConfigEditada] = useState<RecorrenciaConfig | null>(null)
  
  const [leadSelecionado, setLeadSelecionado] = useState<RecorrenciaLead | null>(null)
  const [painelLeadAberto, setPainelLeadAberto] = useState(false)

  const handleNovaConfig = () => {
    setConfigEditada(null)
    setPainelAberto(true)
  }

  const handleEditConfig = (config: RecorrenciaConfig) => {
    setConfigEditada(config)
    setPainelAberto(true)
  }

  return (
    <div style={{ background: 'var(--ws-page-bg)', minHeight: '100%', padding: '24px' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ws-text-1)] tracking-tight">Recorrência</h1>
          <p className="text-sm text-[var(--ws-text-2)]">Remarketing automático para quem já foi cliente</p>
        </div>
        <button 
          onClick={handleNovaConfig}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold shadow-[0_4px_16px_rgba(62,91,255,0.35)] transition-all hover:scale-[1.02]"
          style={{ 
            background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
            border: 'none',
            fontSize: '14px'
          }}
        >
          <Plus size={18} /> Nova Configuração
        </button>
      </div>

      {/* KPIs */}
      <RecorrenciaKpis metricas={metricas} />

      {/* Tabs / Filters Area */}
      <Tabs defaultValue="leads" className="w-full" onValueChange={setAbaAtiva}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            <TabsTrigger 
              value="leads" 
              className="px-0 py-2 border-b-2 rounded-none bg-transparent data-[state=active]:text-[var(--ws-gold)] data-[state=active]:border-[var(--ws-gold)] text-[var(--ws-text-2)] border-transparent font-medium transition-all"
            >
              Leads em Recorrência
            </TabsTrigger>
            <TabsTrigger 
              value="configs" 
              className="px-0 py-2 border-b-2 rounded-none bg-transparent data-[state=active]:text-[var(--ws-gold)] data-[state=active]:border-[var(--ws-gold)] text-[var(--ws-text-2)] border-transparent font-medium transition-all"
            >
              Configurações de Recorrência
            </TabsTrigger>
          </TabsList>

          {abaAtiva === 'leads' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ws-text-3)]" />
                <Input 
                  placeholder="Buscar lead..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9 h-10 w-[240px] bg-[var(--ws-glass-bg)] border-[var(--ws-glass-border)] text-[var(--ws-text-1)]"
                />
              </div>
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger className="w-[140px] h-10 bg-[var(--ws-glass-bg)] border-[var(--ws-glass-border)] text-[var(--ws-text-1)]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="leads" className="mt-0 focus-visible:outline-none">
          <RecorrenciaLista 
            leads={leads} 
            onLeadClick={(lead) => {
              setLeadSelecionado(lead)
              setPainelLeadAberto(true)
            }} 
          />
        </TabsContent>

        <TabsContent value="configs" className="mt-0 focus-visible:outline-none">
          <RecorrenciaConfigCards 
            configs={configs} 
            onEdit={handleEditConfig}
            onToggle={toggleConfigAtiva}
            onNew={handleNovaConfig}
          />
        </TabsContent>
      </Tabs>

      {/* Painel Lateral de Configuração */}
      <RecorrenciaPainel 
        isOpen={painelAberto} 
        onClose={() => setPainelAberto(false)} 
        configInit={configEditada}
        onSave={salvarConfig}
      />

      {/* Painel Lateral do Lead */}
      {leadSelecionado && (
        <RecorrenciaPainelLead
          lead={leadSelecionado}
          aberto={painelLeadAberto}
          onFechar={() => {
            setPainelLeadAberto(false)
            setLeadSelecionado(null)
          }}
          onCancelar={(id) => console.log('Cancelar recorrência:', id)}
        />
      )}
    </div>
  )
}
