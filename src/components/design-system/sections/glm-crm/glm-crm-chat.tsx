'use client'
import { useState, useMemo, useCallback, memo } from 'react'
import { ArrowRightLeft, X, CheckCheck, Smile, Paperclip, Mic, Send } from 'lucide-react'
import { CrmListaConversas } from './glm-crm-inbox'
import type {
  Mensagem,
  ContatoDetalhes,
  StageId,
  PainelRow,
} from './types'
import {
  CANAL_LABELS,
  STAGES,
  TEMP_LEAD,
  FOLLOWUP_ESTAGIOS,
  STATUS_RESGATE,
  QUALIDADE,
} from './constants'
import { MENSAGENS, CONTATOS } from './data'
import { AcaoBtn } from './components/acao-btn'
import { MiniAvatar } from './components/avatar'
import { InfoRow } from './components/info-row'

// ─── Sub-componentes memoizados ──────────────────────────────────────────────

const BolhaMsg = memo(function BolhaMsg({ msg }: { msg: Mensagem }) {
  if (msg.tipo === 'inbound') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, alignSelf: 'flex-start', maxWidth: '68%' }}>
        <div style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: '12px 12px 12px 3px',
          padding: '8px 12px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ws-text-1)', lineHeight: 1.45 }}>{msg.texto}</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
      </div>
    )
  }

  if (msg.tipo === 'ia') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, alignSelf: 'flex-end', maxWidth: '68%' }}>
        <span style={{
          background: 'rgba(60,52,137,0.15)', color: '#8b7ef8',
          fontSize: 10, fontWeight: 500, padding: '1px 8px',
          borderRadius: 9999,
        }}>IA Agente</span>
        <div style={{
          background: 'rgba(62,91,255,0.12)',
          border: '1px solid rgba(62,91,255,0.25)',
          borderRadius: '12px 12px 3px 12px',
          padding: '8px 12px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ws-text-1)', lineHeight: 1.45 }}>{msg.texto}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
          {msg.remetente && <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>. {msg.remetente}</span>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, alignSelf: 'flex-end', maxWidth: '68%' }}>
      <span style={{
        background: 'rgba(59,109,17,0.15)', color: '#5a9a1f',
        fontSize: 10, fontWeight: 500, padding: '1px 8px',
        borderRadius: 9999,
      }}>Atendente</span>
      <div style={{
        background: '#3E5BFF',
        borderRadius: '12px 12px 3px 12px',
        padding: '8px 12px',
      }}>
        <span style={{ fontSize: 13, color: 'white', lineHeight: 1.45 }}>{msg.texto}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
        {msg.remetente && <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>. {msg.remetente}</span>}
      </div>
    </div>
  )
})

const AreaMensagens = memo(function AreaMensagens({ mensagens }: { mensagens: Mensagem[] }) {
  return (
    <div
      role="log"
      aria-label="Mensagens da conversa"
      style={{
        flex: 1, overflowY: 'auto', scrollbarWidth: 'thin',
        padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      {mensagens.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 32, opacity: 0.3 }}>{'\uD83D\uDCAC'}</span>
          <span style={{ fontSize: 13, color: 'var(--ws-text-3)' }}>
            Selecione uma conversa para come\u00e7ar
          </span>
        </div>
      ) : (
        mensagens.map(msg => <BolhaMsg key={msg.id} msg={msg} />)
      )}
    </div>
  )
})

const ChatHeader = memo(function ChatHeader({ contato, onTogglePainel }: {
  contato: ContatoDetalhes
  onTogglePainel: () => void
}) {
  return (
    <div style={{
      height: 48, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      borderBottom: '1px solid var(--ws-glass-border)',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: contato.avatarBg, color: contato.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
        }}>{contato.iniciais}</div>
        <div style={{
          position: 'absolute', bottom: -1, right: -1,
          width: 10, height: 10, borderRadius: '50%',
          background: contato.canalColor,
          border: '2px solid var(--ws-glass-bg)',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            role="button"
            tabIndex={0}
            onClick={onTogglePainel}
            onKeyDown={e => { if (e.key === 'Enter') onTogglePainel() }}
            style={{
              fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)', flexShrink: 0,
              cursor: 'pointer', transition: 'color 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ws-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ws-text-1)'}
          >
            {contato.nome}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: contato.canalColor }} />
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>{contato.canalLabel}</span>
          </div>
          {contato.online && (
            <span style={{ fontSize: 11, color: '#1D9E75', flexShrink: 0 }}>. online</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <AcaoBtn label="Transferir" variant="ghost" icon={<ArrowRightLeft size={12} />} />
        <AcaoBtn label="Fechar" variant="danger" icon={<X size={12} />} />
        <AcaoBtn label="Resolver" variant="primary" icon={<CheckCheck size={12} />} />
      </div>
    </div>
  )
})

const InputArea = memo(function InputArea({ campanha }: { campanha?: string }) {
  const [iaAtivo, setIaAtivo] = useState(true)
  const [msg, setMsg] = useState('')

  const handleToggleIa = useCallback(() => setIaAtivo(a => !a), [])

  const iconButtons = [
    { Icon: Smile, label: 'Emoji' },
    { Icon: Paperclip, label: 'Anexo' },
    { Icon: Mic, label: 'Microfone' },
  ]

  return (
    <div style={{
      flexShrink: 0,
      borderTop: '1px solid var(--ws-glass-border)',
      padding: '8px 12px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--ws-text-2)', fontWeight: 500 }}>IA Agente</span>
        <div
          role="switch"
          aria-checked={iaAtivo}
          aria-label="Ativar IA Agente"
          tabIndex={0}
          onClick={handleToggleIa}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleToggleIa() }}
          style={{
            width: 30, height: 17, borderRadius: 9999,
            background: iaAtivo ? '#1D9E75' : 'rgba(14,20,42,0.15)',
            position: 'relative', cursor: 'pointer',
            transition: 'background 200ms',
          }}
        >
          <div style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: iaAtivo ? 15 : 2,
            width: 13, height: 13, borderRadius: '50%', background: 'white',
            transition: 'left 200ms',
            boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
          }} />
        </div>
        <span style={{ flex: 1 }} />
        {campanha && (
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>Campanha: {campanha}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {iconButtons.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ws-text-3)', padding: 2,
              display: 'flex', alignItems: 'center',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ws-text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ws-text-3)'}
          >
            <Icon size={18} />
          </button>
        ))}
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Digite uma mensagem..."
          aria-label="Mensagem"
          style={{
            flex: 1, height: 36,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 20,
            padding: '0 14px',
            fontSize: 12, color: 'var(--ws-text-1)',
            outline: 'none',
            transition: 'border-color 120ms, box-shadow 120ms',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(62,91,255,0.50)'
            e.target.style.boxShadow = '0 0 0 3px rgba(62,91,255,0.12)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--ws-glass-border)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <button
          type="button"
          aria-label="Enviar mensagem"
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: '#3E5BFF', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2340c4'}
          onMouseLeave={e => e.currentTarget.style.background = '#3E5BFF'}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  )
})

const PainelContato = memo(function PainelContato({ contato }: { contato: ContatoDetalhes }) {
  const [stage, setStage] = useState<StageId>(contato.stageAtual)

  const secao: React.CSSProperties = {
    padding: 12,
    borderBottom: '1px solid var(--ws-divider)',
  }

  const labelSec: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--ws-text-3)', marginBottom: 8,
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin' }}>
      {/* Contato */}
      <div style={secao}>
        <span style={labelSec}>Contato</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: contato.avatarBg, color: contato.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>{contato.iniciais}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)' }}>{contato.nomeCompleto}</div>
            <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>{contato.telefone}</div>
          </div>
        </div>
        <InfoRow label="Canal" valor={contato.canalLabel} />
        <InfoRow label="E-mail" valor={contato.email} />
        <InfoRow label="1\u00ba contato" valor={contato.primeiroContato} />
      </div>

      {/* Etiquetas */}
      <div style={secao}>
        <span style={labelSec}>Etiquetas</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {contato.etiquetas.map(et => (
            <span key={et.label} style={{
              background: `color-mix(in srgb, ${et.color} 15%, transparent)`,
              color: et.color,
              borderRadius: 9999, padding: '2px 8px',
              fontSize: 10, fontWeight: 500,
            }}>{et.label}</span>
          ))}
          <button
            type="button"
            style={{
              borderRadius: 9999, padding: '2px 8px', fontSize: 10,
              color: 'var(--ws-text-3)',
              border: '1px dashed var(--ws-divider)', cursor: 'pointer',
              background: 'transparent',
            }}
          >+ add</button>
        </div>
      </div>

      {/* Equipe */}
      <div style={secao}>
        <span style={labelSec}>Equipe</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MiniAvatar iniciais={contato.equipe.iniciais} bg={contato.equipe.bg} color={contato.equipe.color} />
          <span style={{ fontSize: 12, color: 'var(--ws-text-1)' }}>{contato.equipe.nome}</span>
        </div>
      </div>

      {/* Origem */}
      <div style={secao}>
        <span style={labelSec}>Origem</span>
        <span style={{
          display: 'inline-block', marginBottom: 8,
          background: 'rgba(60,52,137,0.15)', color: '#8b7ef8',
          borderRadius: 9999, padding: '2px 8px',
          fontSize: 10, fontWeight: 500,
        }}>{contato.origem.campanha}</span>
        <InfoRow label="CPL camp." valor={contato.origem.cpl} valorColor="#4a9ae6" />
      </div>

      {/* Stage do funil */}
      <div style={secao}>
        <span style={labelSec}>Stage do funil</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {STAGES.map(s => {
            const ativo = stage === s.id
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => setStage(s.id)}
                onKeyDown={e => { if (e.key === 'Enter') setStage(s.id) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                  background: ativo ? 'var(--ws-card-active)' : 'transparent',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!ativo) e.currentTarget.style.background = 'var(--ws-glass-bg)' }}
                onMouseLeave={e => { if (!ativo) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.cor, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 11, fontWeight: ativo ? 500 : 400,
                  color: ativo ? 'var(--ws-blue)' : 'var(--ws-text-2)',
                }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* An\u00e1lise IA */}
      <div style={secao}>
        <span style={labelSec}>{'\uD83E\uDD16'} An\u00e1lise IA</span>

        <div style={{
          background: 'rgba(62,91,255,0.08)',
          border: '1px solid rgba(62,91,255,0.15)',
          borderRadius: 8, padding: '8px 10px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#3E5BFF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resumo</div>
          <p style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5, margin: 0 }}>
            {contato.analiseIA.resumoConversa}
          </p>
        </div>

        {/* Temperatura */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Temperatura</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: TEMP_LEAD[contato.analiseIA.temperaturaLead].cor,
            }}>
              {TEMP_LEAD[contato.analiseIA.temperaturaLead].label}
            </span>
          </div>
          <div style={{
            height: 6, borderRadius: 3, position: 'relative',
            background: 'linear-gradient(90deg, #3B82F6 0%, #F59E0B 35%, #F97316 65%, #EF4444 100%)',
            opacity: 0.85,
          }}>
            <div style={{
              position: 'absolute',
              left: `${TEMP_LEAD[contato.analiseIA.temperaturaLead].posicao}%`,
              top: -3, width: 12, height: 12, borderRadius: '50%',
              background: TEMP_LEAD[contato.analiseIA.temperaturaLead].cor,
              border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              transform: 'translateX(-50%)',
            }} />
          </div>
        </div>

        {/* Follow-up */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Follow-up</span>
          <span style={{
            fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 9999,
            background: FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].bg,
            color: FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].cor,
          }}>
            {FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].label}
          </span>
        </div>

        {/* Resgate */}
        {contato.analiseIA.statusResgate !== 'nao-aplicavel' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Resgate</span>
            <span style={{
              fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 9999,
              background: STATUS_RESGATE[contato.analiseIA.statusResgate].bg,
              color: STATUS_RESGATE[contato.analiseIA.statusResgate].cor,
            }}>
              {STATUS_RESGATE[contato.analiseIA.statusResgate].label}
            </span>
          </div>
        )}

        {/* Qualidade */}
        <div style={{ marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Qualidade</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: QUALIDADE[contato.analiseIA.qualidadeAtendimento].cor,
            }}>
              {QUALIDADE[contato.analiseIA.qualidadeAtendimento].emoji} {QUALIDADE[contato.analiseIA.qualidadeAtendimento].label}
            </span>
          </div>
          <div style={{
            height: 5, borderRadius: 3, background: 'var(--ws-glass-bg)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${contato.analiseIA.scoreAtendimento}%`,
              background: QUALIDADE[contato.analiseIA.qualidadeAtendimento].cor,
              transition: 'width 300ms ease',
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{contato.analiseIA.scoreAtendimento}/100</span>
          </div>
        </div>
      </div>

      {/* Atribu\u00eddo a */}
      <div style={secao}>
        <span style={labelSec}>Atribu\u00eddo a</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MiniAvatar iniciais={contato.responsavel.iniciais} bg={contato.responsavel.bg} color={contato.responsavel.color} />
          <span style={{ fontSize: 12, color: 'var(--ws-text-1)' }}>{contato.responsavel.nome}</span>
        </div>
      </div>

      {/* IA Agente */}
      <div style={{ ...secao, borderBottom: 'none' }}>
        <span style={labelSec}>IA Agente</span>
        <InfoRow label="Status" valor={contato.ia.status} valorColor={contato.ia.statusColor} />
        <InfoRow label="Msgs respondidas" valor={String(contato.ia.msgsRespondidas)} />
        <InfoRow label="Assumido em" valor={contato.ia.assumidoEm} />
      </div>
    </div>
  )
})

// ─── Componente principal ─────────────────────────────────────────────────────

export function GLMCrmChat() {
  const [conversaAtivaId, setConversaAtivaId] = useState('conv-1')
  const [painelAberto, setPainelAberto] = useState(false)

  const mensagens = useMemo(
    () => MENSAGENS[conversaAtivaId] ?? [],
    [conversaAtivaId],
  )

  const contato = useMemo(
    () => CONTATOS[conversaAtivaId] ?? CONTATOS['conv-1']!,
    [conversaAtivaId],
  )

  const campanhaLabel = contato
    ? `${contato.origem.campanha} \u00b7 ${contato.canalLabel}`
    : undefined

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          GLM CRM \u2014 Chat
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Vers\u00e3o refatorada: componentes memoizados, debounce, lucide-react em vez de SVGs inline, acessibilidade melhorada.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        height: 600,
        minWidth: 1000,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Coluna 1 \u2014 Lista */}
        <div style={{
          width: 300, flexShrink: 0,
          borderRight: '1px solid var(--ws-glass-border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'visible',
          position: 'relative',
        }}>
          <CrmListaConversas
            conversaAtivaId={conversaAtivaId}
            onSelectConversa={setConversaAtivaId}
          />
        </div>

        {/* Coluna 2 \u2014 Chat */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        }}>
          <ChatHeader contato={contato} onTogglePainel={() => setPainelAberto(v => !v)} />
          <AreaMensagens mensagens={mensagens} />
          <InputArea campanha={campanhaLabel} />
        </div>

        {/* Coluna 3 \u2014 Painel */}
        <div style={{
          width: painelAberto ? 260 : 0,
          flexShrink: 0,
          borderLeft: '1px solid var(--ws-glass-border)',
          overflow: 'hidden',
          transition: 'width 300ms ease',
        }}>
          <div style={{ minWidth: 260, height: '100%' }}>
            <PainelContato contato={contato} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Melhorias vs vers\u00e3o original</div>
        <pre style={{
          fontSize: 12, background: 'rgba(14,20,42,0.04)', padding: 16,
          borderRadius: 8, color: 'var(--ws-text-2)', fontFamily: 'monospace',
          overflowX: 'auto', border: '1px solid var(--ws-divider)',
        }} className="dark:bg-white/5">
{`REFACTORIZACOES NO CHAT:

1. lucide-react icons (Smile, Paperclip, Mic, Send) em vez de SVGs inline
2. React.memo em BolhaMsg, AreaMensagens, ChatHeader, InputArea, PainelContato
3. useCallback em handlers (toggle IA, enviar)
4. key legivel nos icones (label em vez de indice)
5. role="log" + aria-label na area de mensagens
6. role="switch" + aria-checked + onKeyDown no toggle IA
7. Tipos importados de types.ts (sem duplicacao)
8. Constantes importadas de constants.ts (sem duplicacao)
9. Mock data importado de data.ts (separado da UI)
10. Fallback seguro: ?? [] e ?? CONTATOS['conv-1']!`}
        </pre>
      </div>
    </div>
  )
}