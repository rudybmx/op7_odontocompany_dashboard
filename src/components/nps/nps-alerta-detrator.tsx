'use client'

import React from 'react'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { NpsResposta } from '@/types/nps'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface NpsAlertaDetrtorProps {
  detratores: NpsResposta[]
  onVerDetratores: () => void
}

export function NpsAlertaDetrator({ detratores, onVerDetratores }: NpsAlertaDetrtorProps) {
  if (detratores.length === 0) return null

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(255,92,141,0.08)',
        border: '1px solid rgba(255,92,141,0.25)',
        borderLeft: '4px solid var(--ws-coral)',
        borderRadius: 'var(--ws-radius-lg)',
        padding: '16px 20px',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Ícone pulsante */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'rgba(255,92,141,0.4)',
                animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,92,141,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} color="var(--ws-coral)" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ws-coral)' }}>
                ⚠️ {detratores.length} atendimento{detratores.length > 1 ? 's' : ''} com nota baixa aguardam{detratores.length > 1 ? '' : 'a'} sua atenção
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  background: 'var(--ws-coral)',
                  color: '#ffffff',
                  borderRadius: 9999,
                  padding: '2px 8px',
                  animation: 'pulse 2s infinite',
                }}
              >
                REQUER ATENÇÃO
              </span>
            </div>

            {/* Lista resumida */}
            <div className="flex flex-wrap gap-2 mt-2">
              {detratores.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: 'rgba(255,92,141,0.12)',
                    border: '0.5px solid rgba(255,92,141,0.3)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--ws-text-1)',
                  }}
                >
                  <span
                    style={{
                      background: 'var(--ws-coral)',
                      color: '#ffffff',
                      borderRadius: 9999,
                      padding: '1px 7px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {d.score}
                  </span>
                  <span style={{ fontWeight: 600 }}>{d.cliente_nome.split(' ')[0]}</span>
                  <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>
                    {formatDistanceToNow(parseISO(d.enviado_em), { locale: ptBR, addSuffix: true })}
                  </span>
                </div>
              ))}
              {detratores.length > 4 && (
                <div
                  style={{
                    background: 'rgba(255,92,141,0.08)',
                    border: '0.5px solid rgba(255,92,141,0.2)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 12,
                    color: 'var(--ws-coral)',
                    fontWeight: 600,
                  }}
                >
                  +{detratores.length - 4} mais
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={onVerDetratores}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--ws-coral)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--ws-radius-md)',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Resolver Todos
          <ChevronRight size={16} />
        </button>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
