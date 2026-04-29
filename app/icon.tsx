import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 14,
            height: 22,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid white',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
