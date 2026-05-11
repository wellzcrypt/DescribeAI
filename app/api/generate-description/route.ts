import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { features, tone } = await request.json()

    if (!features || !tone) {
      return NextResponse.json(
        { error: 'Features and tone are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GOOGLE_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Generate a compelling product description based on the following:

Features: ${features}
Tone: ${tone}

Create a professional and engaging product description that sells the product based on the given features and tone. Keep it concise but impactful (2-3 paragraphs).`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ description: text })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
