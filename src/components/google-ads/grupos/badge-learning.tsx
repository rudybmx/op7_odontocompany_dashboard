export function BadgeLearning({ diasAprendizado }: { diasAprendizado: number }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 9999,
      fontSize: 10,
      fontWeight: 600,
      background: 'rgba(62,91,255,0.12)',
      color: '#2340c4',
      border: '1px solid rgba(62,91,255,0.25)',
      whiteSpace: 'nowrap',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      Aprendendo{diasAprendizado > 0 ? ` ~${diasAprendizado}d` : ''}
    </span>
  )
}
