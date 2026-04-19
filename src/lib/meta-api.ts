import type {
  ContaAnuncio,
  CriativoTop,
  LeadsByPlatform,
} from '@/types/meta-ads'

const META_API_BASE = 'https://graph.facebook.com/v21.0'

// Real endpoint: GET /{ad_account_id}/insights
// fields: spend,impressions,clicks,reach,frequency,cpm,cpc,ctr,
//         actions,cost_per_action_type,account_currency,date_start,date_stop
// breakdowns: publisher_platform,impression_device
// time_increment: 1 (daily)
export async function buscarInsightsContaCampanha(
  adAccountId: string,
  accessToken: string,
  dataInicio: string,
  dataFim: string
): Promise<ContaAnuncio | null> {
  // TODO: implement real API call
  // const url = `${META_API_BASE}/act_${adAccountId}/insights?fields=spend,impressions,clicks,reach,frequency,cpm,cpc,ctr,actions,cost_per_action_type&time_range={"since":"${dataInicio}","until":"${dataFim}"}&time_increment=1&access_token=${accessToken}`
  return null
}

// Real endpoint: GET /act_{ad_account_id}
// fields: balance,amount_spent,currency,name,account_status
export async function buscarSaldoConta(
  adAccountId: string,
  accessToken: string
): Promise<{ saldo: number; saldoInicial: number } | null> {
  // TODO: implement real API call
  // const url = `${META_API_BASE}/act_${adAccountId}?fields=balance,amount_spent,currency,name,account_status&access_token=${accessToken}`
  return null
}

// Real endpoint: GET /act_{ad_account_id}/ads
// fields: creative{id,name,thumbnail_url},insights{impressions,actions,ctr,cost_per_action_type}
// filtering: [{"field":"impressions","operator":"GREATER_THAN","value":"0"}]
export async function buscarTopCriativos(
  adAccountId: string,
  accessToken: string,
  dataInicio: string,
  dataFim: string,
  limit: number = 3
): Promise<CriativoTop[]> {
  // TODO: implement real API call
  // const url = `${META_API_BASE}/act_${adAccountId}/ads?fields=creative{id,name,thumbnail_url},insights.fields(impressions,actions,ctr,cost_per_action_type).time_range({"since":"${dataInicio}","until":"${dataFim}"})&filtering=[{"field":"impressions","operator":"GREATER_THAN","value":"0"}]&limit=${limit}&access_token=${accessToken}`
  return []
}

// actions field breakdown for leads by platform:
// action_type: "lead", "leadgen_other", "onsite_conversion.messaging_conversation_started_7d"
// publisher_platform breakdown gives: facebook, instagram, messenger, whatsapp
export function extrairLeadsPorPlataforma(actions: unknown[]): LeadsByPlatform[] {
  // TODO: implement breakdown extraction
  return []
}

export { META_API_BASE }