import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })

export type ExtractedTags = {
  apps: string[]
  widgets: string[]
  wallpaper_colors: string[]
  theme: 'dark' | 'light'
  dock_apps: string[]
}

const PROMPT = `Analyze this iOS home screen screenshot and return JSON only, no explanation.
Format: {"apps":["AppName",...],"widgets":["WidgetName",...],"wallpaper_colors":["#hex",...],"theme":"dark"|"light","dock_apps":["AppName",...]}
- apps: top-level app icons on home screen ONLY. EXCLUDE apps shown inside folder previews (mini icons in folder thumbnails). Folder itself is not an app — skip folders entirely.
- widgets: widget types visible (e.g. "Weather", "Calendar")
- wallpaper_colors: 2-3 dominant hex colors from wallpaper
- theme: overall dark or light
- dock_apps: top-level apps in bottom dock ONLY. EXCLUDE apps inside folders.`

export async function analyzeScreenshot(imageUrl: string): Promise<ExtractedTags> {
  const res = await fetch(imageUrl)
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const mimeType = res.headers.get('content-type') ?? 'image/png'

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: PROMPT },
        ],
      },
    ],
  })

  const text = result.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0]) as ExtractedTags
}
