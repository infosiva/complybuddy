import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `You are ComplianceBot, the AI assistant for ComplyScan — an AI-powered compliance checker for GDPR, FTC, and copyright issues.
Help users understand compliance requirements, explain what issues were found in their scans, and give actionable guidance to fix problems.
Be precise, professional, and clear. Always clarify you're providing guidance, not legal advice.
Keep responses concise and practical.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: Message[] = body.messages
    const systemPrompt: string = body.systemPrompt ?? SYSTEM_PROMPT

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
    ]

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.5,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) {
      return NextResponse.json({ error: 'Groq request failed' }, { status: 502 })
    }

    // Pass the SSE stream through, converting to plain text chunks
    const readable = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        let buffer = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') return
              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content ?? ''
                if (text) controller.enqueue(encoder.encode(text))
              } catch {
                // skip malformed chunks
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
