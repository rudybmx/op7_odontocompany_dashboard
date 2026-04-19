import { memo } from 'react'
import type { AvatarVariant, Canal } from '../types'
import { AVATAR_STYLES, CANAL_COLORS } from '../constants'

export const Avatar = memo(function Avatar({
  iniciais,
  variant,
  canal,
  parentBg,
  size = 36,
}: {
  iniciais: string
  variant: AvatarVariant
  canal: Canal
  parentBg?: string
  size?: number
}) {
  const s = AVATAR_STYLES[variant]
  return (
    <div style={{ position: 'relative', flexShrink: 0, overflow: 'visible' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: s.bg,
          color: s.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size < 28 ? 9 : 12,
          fontWeight: 600,
        }}
      >
        {iniciais}
      </div>
      {canal && (
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: size < 28 ? 8 : 12,
            height: size < 28 ? 8 : 12,
            borderRadius: '50%',
            background: CANAL_COLORS[canal],
            border: `2px solid ${parentBg ?? 'var(--ws-glass-bg)'}`,
          }}
        />
      )}
    </div>
  )
})

export const MiniAvatar = memo(function MiniAvatar({
  iniciais,
  bg,
  color,
}: {
  iniciais: string
  bg: string
  color: string
}) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: bg,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {iniciais}
    </div>
  )
})