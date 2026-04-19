import { PaginaEmConstrucao } from '@/components/layout/pagina-em-construcao'
import { BreadcrumbMobile } from '@/components/ui/breadcrumb-mobile'
import { siWhatsapp } from 'simple-icons'

export default function Page() {
  return (
    <div>
      <div style={{ padding: '24px 32px 0' }}>
        <BreadcrumbMobile
          plataforma="WhatsApp"
          paginaAtual="Campanhas"
          iconeSvgPath={siWhatsapp.path}
          iconeCor="#25D366"
        />
      </div>
      <PaginaEmConstrucao titulo="WhatsApp" />
    </div>
  )
}
