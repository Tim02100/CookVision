import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialisieren Sie die Gemini API mit Ihrem API-Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const image = formData.get('image') as File

  if (!image) {
    return NextResponse.json({ error: 'Kein Bild gefunden' }, { status: 400 })
  }

  try {
    // Konvertieren Sie das Bild in ein Uint8Array
    const arrayBuffer = await image.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Erstellen Sie ein Gemini-Modell
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    // Analysieren Sie das Bild
    const result = await model.generateContent([
      "Identifiziere die Zutaten in diesem Bild und gib sie als kommagetrennte Liste zurück.",
      {
        inlineData: {
          mimeType: image.type,
          data: Buffer.from(uint8Array).toString('base64')
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    const ingredients = text.split(',').map(item => item.trim())

    return NextResponse.json({ ingredients })
  } catch (error) {
    console.error('Fehler bei der Bildanalyse:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
