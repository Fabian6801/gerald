import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name: fullName, phone, email, service, date: preferredDate, location, message: details } = body

    // basic validation
    if (!fullName ||!phone ||!service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
     .from('bookings')
     .insert([
        {
          client_name: fullName,
          phone: phone,
          email: email,
          service: service,
          preferred_date: preferredDate || null,
          location: location,
          details: details,
          status: 'pending'
        }
      ])

    if (error) {
      console.log(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
