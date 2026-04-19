// No futuro: substituir por fetch/SWR/React Query com autenticação
import {
  MENSAGENS,
  CONTATOS,
  CARDS_INBOX,
  USUARIO_ATUAL,
} from '@/components/design-system/sections/glm-crm/data'

export function useCrmConversas() {
  return {
    mensagens: MENSAGENS,
    contatos: CONTATOS,
    conversas: CARDS_INBOX,
    usuarioAtual: USUARIO_ATUAL,
  }
}
