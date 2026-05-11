export function proxyImagem(url: string | undefined): string | undefined {
  if (!url) return undefined
  if (!url.includes('fbcdn.net') && !url.includes('facebook.com')) {
    return url
  }
  return `/api/proxy/meta/imagem?url=${encodeURIComponent(url)}`
}
