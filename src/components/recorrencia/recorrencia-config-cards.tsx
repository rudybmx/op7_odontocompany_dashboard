'use client'

import React from 'react'
import { 
  Edit2, 
  MoreVertical, 
  MessageSquare, 
  Calendar, 
  Repeat, 
  Settings2,
  Users,
  CheckCircle2,
  Trash2,
  Search,
  Plus
} from 'lucide-react'
import { RecorrenciaConfig } from '@/types/followup'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RecorrenciaConfigCardsProps {
  configs: RecorrenciaConfig[]
  onEdit: (config: RecorrenciaConfig) => void
  onToggle: (id: string, active: boolean) => void
  onNew: () => void
}

export function RecorrenciaConfigCards({ configs, onEdit, onToggle, onNew }: RecorrenciaConfigCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Botão de Adicionar Nova (Card pontilhado) */}
      <div 
        onClick={onNew}
        className="group cursor-pointer flex flex-col items-center justify-center p-8 transition-all hover:bg-white/5"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '2px dashed var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          minHeight: '220px'
        }}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--ws-blue-soft)] text-[var(--ws-blue)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus size={24} />
        </div>
        <span className="text-[var(--ws-text-1)] font-medium">Nova Configuração de Recorrência</span>
        <span className="text-xs text-[var(--ws-text-2)] mt-1">Crie réguas automáticas de remarketing</span>
      </div>

      {configs.map((config) => (
        <div 
          key={config.id}
          style={{
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--ws-glass-shadow)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top light line */}
          <div style={{ position:'absolute',top:0,left:0,right:0,height:1,
            background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)',
            pointerEvents:'none' }} />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--ws-blue-soft)] text-[var(--ws-blue)]">
                <Repeat size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--ws-text-1)]">{config.nome} — {config.dias_apos_trigger} dias</h3>
                <p className="text-[10px] text-[var(--ws-text-2)] font-medium uppercase tracking-wider">
                  TRIGGER: {config.trigger === 'pos_comparecimento' ? 'Pós-Comparecimento' : 'Outro'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onEdit(config)}
                className="p-2 hover:bg-white/5 rounded-lg text-[var(--ws-text-2)] transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--ws-text-2)]">
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--ws-glass-border)', margin: '0 -20px 16px' }} />

          {/* Body */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-[var(--ws-text-2)] font-semibold flex items-center gap-1.5">
                <Calendar size={10} /> Delay
              </span>
              <p className="text-xs text-[var(--ws-text-1)] font-medium">{config.dias_apos_trigger} dias</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-[var(--ws-text-2)] font-semibold flex items-center gap-1.5">
                <Search size={10} /> Filtro
              </span>
              <p className="text-xs text-[var(--ws-text-1)] font-medium truncate">
                {config.filtro_servico || 'Sem filtro'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-[var(--ws-text-2)] font-semibold flex items-center gap-1.5">
                <Settings2 size={10} /> Cadência
              </span>
              <p className="text-xs text-[var(--ws-text-1)] font-medium">
                {config.cadencia.tipo} · {config.cadencia.max_tentativas} tent.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-[var(--ws-text-2)] font-semibold flex items-center gap-1.5">
                <MessageSquare size={10} /> Canal
              </span>
              <p className="text-xs text-[var(--ws-text-1)] font-medium capitalize">{config.cadencia.canal}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--ws-glass-border)] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <div 
                className={`w-2 h-2 rounded-full ${config.ativo ? 'bg-[var(--ws-green)]' : 'bg-gray-500'}`}
              />
              <span className={config.ativo ? 'text-[var(--ws-green)]' : 'text-gray-500'}>
                {config.ativo ? '🟢 Ativo' : '⚪ Inativo'}
              </span>
              <span className="text-[var(--ws-text-3)] ml-2">· 12 leads alocados</span>
            </div>
            <Switch 
              checked={config.ativo} 
              onCheckedChange={(val) => onToggle(config.id, val)} 
            />
          </div>
        </div>
      ))}
    </div>
  )
}
