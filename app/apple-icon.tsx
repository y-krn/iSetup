import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 80,
            height: 130,
            borderRadius: 22,
            background: 'rgba(255,255,255,0.95)',
            border: '6px solid white',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
