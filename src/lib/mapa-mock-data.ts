import { createChildNode, createRootNode, generateEdgeId } from '@/lib/mapa-utils'
import type { MindMap, MapaEdge, MapaNode } from '@/types/mapa'

interface TreeItem {
  label: string
  children?: TreeItem[]
}

function buildMapNodes(rootLabel: string, tree: TreeItem[]): { nodes: MapaNode[]; edges: MapaEdge[] } {
  const root = createRootNode(rootLabel)
  const nodes: MapaNode[] = [root]
  const edges: MapaEdge[] = []

  const walk = (parentNode: MapaNode, items: TreeItem[]) => {
    items.forEach((item) => {
      const child = createChildNode(parentNode.id, parentNode.data.level, item.label)
      nodes.push(child)
      edges.push({
        id: generateEdgeId(parentNode.id, child.id),
        source: parentNode.id,
        target: child.id,
        type: 'smoothstep',
        animated: false,
      })

      if (item.children?.length) {
        walk(child, item.children)
      }
    })
  }

  walk(root, tree)

  return { nodes, edges }
}

function buildMap(
  clientId: string,
  clientName: string,
  title: string,
  createdAt: string,
  createdBy: string,
  rootLabel: string,
  tree: TreeItem[],
  description?: string
): MindMap {
  const { nodes, edges } = buildMapNodes(rootLabel, tree)
  return {
    id: `${clientId}-${title.toLowerCase().replace(/\s+/g, '-')}`,
    clientId,
    clientName,
    title,
    description,
    createdAt,
    updatedAt: createdAt,
    createdBy,
    nodes,
    edges,
  }
}

export const mindMaps: MindMap[] = [
  buildMap(
    'lumie',
    'Clínica Estética Lumié',
    'Estratégia Q2 2025',
    '2025-04-10',
    'Fernanda Reis',
    'Estratégia Q2',
    [
      {
        label: 'Meta Ads',
        children: [
          { label: 'Awareness', children: [{ label: 'Reels 15s' }, { label: 'Stories carousel' }] },
          { label: 'Conversão', children: [{ label: 'Lead form' }, { label: 'WhatsApp CTA' }] },
        ],
      },
      { label: 'Google Ads', children: [{ label: 'Search branded' }, { label: 'Display retargeting' }] },
      {
        label: 'Conteúdo Orgânico',
        children: [
          { label: 'Instagram', children: [{ label: 'Feed 3x/semana' }, { label: 'Stories diário' }] },
          { label: 'TikTok', children: [{ label: '2 vídeos/semana' }] },
        ],
      },
    ]
  ),
  buildMap(
    'lumie',
    'Clínica Estética Lumié',
    'Posicionamento de Marca',
    '2025-03-02',
    'Ana Lima',
    'Clínica Lumié',
    [
      { label: 'Pilares', children: [{ label: 'Confiança' }, { label: 'Resultados' }, { label: 'Experiência' }] },
      {
        label: 'Tom de Voz',
        children: [{ label: 'Acolhedor' }, { label: 'Técnico mas acessível' }, { label: 'Aspiracional' }],
      },
      { label: 'Público-Alvo', children: [{ label: 'Mulheres 28-45' }, { label: 'Classe A/B' }, { label: 'Interesse em bem-estar' }] },
    ]
  ),
  buildMap(
    'bravo',
    'Auto Peças Bravo',
    'Campanhas de Giro Rápido',
    '2025-04-05',
    'Marcos Dutra',
    'Giro Rápido 2025',
    [
      { label: 'Meta Ads', children: [{ label: 'Ofertas semanais' }, { label: 'Catálogo dinâmico' }] },
      { label: 'Google Ads', children: [{ label: 'Search peças urgentes' }, { label: 'Performance Max oficinas' }] },
      { label: 'CRM', children: [{ label: 'WhatsApp reativação' }, { label: 'Lista VIP lojistas' }] },
    ]
  ),
  buildMap(
    'bravo',
    'Auto Peças Bravo',
    'Jornada do Comprador',
    '2025-02-18',
    'Leo Costa',
    'Jornada B2B/B2C',
    [
      { label: 'Descoberta', children: [{ label: 'Busca emergencial' }, { label: 'Indicação da oficina' }] },
      { label: 'Consideração', children: [{ label: 'Preço' }, { label: 'Disponibilidade' }, { label: 'Entrega' }] },
      { label: 'Conversão', children: [{ label: 'Retirada balcão' }, { label: 'Entrega expressa' }] },
    ]
  ),
  buildMap(
    'viva',
    'Colégio Viva',
    'Calendário de Captação',
    '2025-04-08',
    'Ana Lima',
    'Captação 2025',
    [
      { label: 'Matrículas', children: [{ label: 'Open Day' }, { label: 'Bolsas' }, { label: 'Retargeting visitas' }] },
      { label: 'Conteúdo', children: [{ label: 'Vida escolar' }, { label: 'Resultados pedagógicos' }] },
      { label: 'Relacionamento', children: [{ label: 'Pais atuais' }, { label: 'Leads frios' }] },
    ]
  ),
  buildMap(
    'viva',
    'Colégio Viva',
    'Tom de Voz Institucional',
    '2025-03-11',
    'Juliana Park',
    'Colégio Viva',
    [
      { label: 'Essência', children: [{ label: 'Acolhimento' }, { label: 'Excelência' }, { label: 'Pertencimento' }] },
      { label: 'Mensagens-chave', children: [{ label: 'Desenvolvimento integral' }, { label: 'Segurança' }] },
      { label: 'Objeções', children: [{ label: 'Preço' }, { label: 'Deslocamento' }] },
    ]
  ),
  buildMap(
    'apex',
    'Imobiliária Apex',
    'Lançamentos Premium',
    '2025-04-10',
    'Juliana Park',
    'Lançamentos Apex',
    [
      { label: 'Meta Ads', children: [{ label: 'Vídeo tour' }, { label: 'Lead form' }, { label: 'Remarketing' }] },
      { label: 'LinkedIn Ads', children: [{ label: 'Investidores' }, { label: 'Executivos relocation' }] },
      { label: 'Corretoria', children: [{ label: 'Script comercial' }, { label: 'Follow-up WhatsApp' }] },
    ]
  ),
  buildMap(
    'apex',
    'Imobiliária Apex',
    'Análise de Concorrência',
    '2025-02-26',
    'Fernanda Reis',
    'Concorrência Regional',
    [
      { label: 'Preço', children: [{ label: 'Compactos' }, { label: 'Premium' }] },
      { label: 'Posicionamento', children: [{ label: 'Luxo' }, { label: 'Investimento' }, { label: 'Família' }] },
      { label: 'Canais', children: [{ label: 'Portais' }, { label: 'Meta Ads' }, { label: 'Google' }] },
    ]
  ),
]

export const mapaClients = Array.from(
  new Map(mindMaps.map((map) => [map.clientId, { id: map.clientId, name: map.clientName }])).values()
)
