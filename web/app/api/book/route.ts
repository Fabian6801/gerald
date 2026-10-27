import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
      if (!body.terms_agreement && !body.agreed_to_terms ) {
        return NextResponse.json({ error: 'You must agree to terms' }, { status: 400 })
      }
    const res = await fetch('http://localhost:8000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    
    if (!res.ok) {
      return NextResponse.json({ error: data.detail }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

