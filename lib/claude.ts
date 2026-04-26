import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type ExtractedTags = {
  apps: string[]
  widgets: string[]
  wallpaper_colors: string[]
  theme: 'dark' | 'light'
  dock_apps: string[]
}

const PROMPT = `Analyze this iOS home screen screenshot and return JSON only, no explanation.
Format: {"apps":["AppName",...],"widgets":["WidgetName",...],"wallpaper_colors":["#hex",...],"theme":"dark"|"light","dock_apps":["AppName",...]}
- apps: visible app names on home screen (not dock)
- widgets: widget types visible (e.g. "Weather", "Calendar")
- wallpaper_colors: 2-3 dominant hex colors from wallpaper
- theme: overall dark or light
- dock_apps: apps in bottom dock`

export async function analyzeScreenshot(imageUrl: string): Promise<ExtractedTags> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'url', url: imageUrl } },
          { type: 'text', text: PROMPT },
        ],
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')

  return JSON.parse(jsonMatch[0]) as ExtractedTags
}
