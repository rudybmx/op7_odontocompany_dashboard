import { PaginaEmConstrucao } from '@/components/layout/pagina-em-construcao'
import { BreadcrumbMobile } from '@/components/ui/breadcrumb-mobile'
import { siTiktok } from 'simple-icons'

export default function Page() {
  return (
    <div>
      <div style={{ padding: '24px 32px 0' }}>
        <BreadcrumbMobile
          plataforma="TikTok Ads"
          paginaAtual="Campanhas"
          iconeSvgPath={siTiktok.path}
          iconeCor="#010101"
        />
      </div>
      <PaginaEmConstrucao titulo="TikTok Ads" />
    </div>
  )
}
