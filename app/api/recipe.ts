// app/api/recipe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const { ingredients } = await req.json()

  if (!ingredients) {
    return NextResponse.json({ error: 'Keine Zutaten angegeben' }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent([
      `Gib ein Rezept basierend auf den folgenden Zutaten: ${ingredients}`
    ])

    const response = await result.response
    const recipe = response.text()

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Fehler bei der Rezeptgenerierung:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
