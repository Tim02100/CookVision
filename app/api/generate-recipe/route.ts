// app/api/generate-recipe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { ingredients } = await req.json()

  if (!ingredients) {
    return NextResponse.json({ error: 'Keine Zutaten gefunden' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const result = await model.generateContent([
      `Erstelle ein Rezept basierend auf den folgenden Zutaten: ${ingredients}`,
    ])

    const response = await result.response
    const text = response.text()

    return NextResponse.json({ recipe: text })
  } catch (error) {
    console.error('Fehler beim Generieren des Rezepts:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
