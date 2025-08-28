// src/app/api/lead/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Here you would normally save to database or send email
    console.log('Lead received:', body)
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'שגיאה בשליחת הטופס' },
      { status: 500 }
    )
  }
}