'use client'

import React, { useState } from 'react'
import { MiniGauge } from '@/components/ui/mini-gauge'

function GaugeCard({ value, label, description }: { value: number; label: string; description: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <MiniGauge value={value} size={64} strokeWidth={5} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ws-text-2)' }}>
          {description}
        </div>
      </div>
    </div>
  )
}

function KpiCardWithGauge({ 
  label, 
  value, 
  delta, 
  positive, 
  gaugeValue, 
  gaugeColor 
}: { 
  label: string; 
  value: string; 
  delta: string; 
  positive: boolean; 
  gaugeValue: number; 
  gaugeColor?: string;
}) {
  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: `1px solid var(--ws-glass-border)`,
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: `var(--ws-glass-shadow)`,
      padding: '20px 16px 16px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'var(--ws-transition)',
    }}>
      {/* shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--ws-text-3)', marginBottom: 8 }}>{label}</div>

      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ws-text-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 12, color: positive ? 'var(--ws-green)' : 'var(--ws-coral)', fontWeight: 500 }}>
          {positive ? '↑' : '↓'} {delta}
        </span>
      </div>

      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        <MiniGauge 
          value={gaugeValue} 
          size={44} 
          strokeWidth={3.5} 
          color={gaugeColor} 
          trend={positive ? 'up' : 'down'}
        />
      </div>
    </div>
  )
}

export function DSMiniGauge() {
  const [sliderValue, setSliderValue] = useState<number>(75)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Mini Gauge</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Indicador circular em SVG puro (sem lib externa) para métricas de percentual (0 a 100).
        </p>
      </div>

      {/* PARTE 1: Galeria de variações */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 16 }}>
          1. Escala de Status Automática
        </h3>
        <div style={{
          display: 'flex', gap: 32, padding: 24,
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          overflowX: 'auto'
        }}>
          <GaugeCard value={15} label="15%" description="Abaixo" />
          <GaugeCard value={45} label="45%" description="Atenção" />
          <GaugeCard value={68} label="68%" description="Bom" />
          <GaugeCard value={85} label="85%" description="Muito Bom" />
          <GaugeCard value={96} label="96%" description="Excelente" />
        </div>
      </div>

      {/* PARTE 2: Demo interativo */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 16 }}>
          2. Demo Interativo
        </h3>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40,
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
        }}>
          <MiniGauge value={sliderValue} size={80} strokeWidth={6} />
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{ width: '100%', maxWidth: 300, marginTop: 32 }}
          />
          <div style={{ fontSize: 13, color: 'var(--ws-text-2)', marginTop: 12 }}>
            Arraste para ver as variações de cor
          </div>
        </div>
      </div>

      {/* PARTE 3: KPI Cards Integrados */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 16 }}>
          3. Integração com KPI Cards
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <KpiCardWithGauge 
            label="Investimento" 
            value="R$ 8.732" 
            delta="14,2%" 
            positive={true} 
            gaugeValue={72} 
          />
          <KpiCardWithGauge 
            label="Leads" 
            value="1.458" 
            delta="22,1%" 
            positive={true} 
            gaugeValue={92} 
          />
          <KpiCardWithGauge 
            label="CPL Médio" 
            value="R$ 0,59" 
            delta="6,2%" 
            positive={false} 
            gaugeValue={38} 
            gaugeColor="#FF5C8D" // Forçar coral
          />
        </div>
      </div>

      {/* PARTE 4: Documentação */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 16 }}>
          4. Documentação para Agentes
        </h3>
        <div style={{
          background: 'var(--ws-navy)',
          padding: 20,
          borderRadius: 'var(--ws-radius-lg)',
          color: '#e3e3e0',
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: 'auto'
        }}>
          <pre>
{`COMPONENTE: MiniGauge
ARQUIVO: src/components/ui/mini-gauge.tsx
USO: Canto superior direito do KPI card (absolute top-3 right-3)

Props:
  value: 0–100 (percentual vs período anterior)
  size: 44 (dentro de card), 64 (standalone)
  strokeWidth: 3.5 (card), 5 (standalone)
  color: automático por valor (não passar para usar padrão)
  trend: 'up' | 'down' | 'neutral'

Cor automática:
  0–33%   → #FF5C8D (ruim)
  34–66%  → #EF9F27 (atenção)
  67–89%  → #3E5BFF (bom)
  90–100% → #0fa856 (excelente)

ATENÇÃO: Para métricas inversas (CPL, CPA, CPC):
  Se o valor subiu → gauge menor → cor coral
  Inverter o value antes de passar para o componente:
  gaugeValue = 100 - percentualVariacao`}
          </pre>
        </div>
      </div>
    </div>
  )
}
