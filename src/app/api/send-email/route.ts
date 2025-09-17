import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substr(2, 9)
  console.log(`[${requestId}] === Email API Request Started ===`)
  
  try {
    // Parse and validate request body
    let body
    try {
      body = await request.json()
      console.log(`[${requestId}] Request parsed successfully:`, { 
        name: body.name, 
        email: body.email, 
        source: body.source,
        hasMessage: !!body.message 
      })
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError)
      return NextResponse.json(
        { error: 'Invalid request format', requestId }, 
        { status: 400 }
      )
    }
    
    const { name, email, phone, company, message, source, subject } = body

    // Validate required fields
    const missingFields = []
    if (!name?.trim()) missingFields.push('name')
    if (!email?.trim()) missingFields.push('email') 
    if (!message?.trim()) missingFields.push('message')
    if (!source?.trim()) missingFields.push('source')

    if (missingFields.length > 0) {
      console.error(`[${requestId}] Missing required fields:`, missingFields)
      return NextResponse.json({ 
        error: 'חסרים שדות חובה', 
        missingFields, 
        requestId 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error(`[${requestId}] Invalid email format:`, email)
      return NextResponse.json({ 
        error: 'כתובת אימייל לא תקינה', 
        requestId 
      }, { status: 400 })
    }

    // Check environment configuration
    if (!process.env.RESEND_API_KEY) {
      console.error(`[${requestId}] RESEND_API_KEY not configured`)
      return NextResponse.json({ 
        error: 'Email service not configured', 
        requestId 
      }, { status: 500 })
    }

    console.log(`[${requestId}] Creating email content...`)
    const emailContent = createEmailContent({ name, email, phone, company, message, source, subject })

    console.log(`[${requestId}] Sending email via Resend...`)
    const startTime = Date.now()
    
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['meirnir89@gmail.com'], // Replace with your email
      subject: `טופס חדש: ${source || 'צור קשר'} - ${name}`,
      html: emailContent,
      replyTo: email,
    })

    const duration = Date.now() - startTime
    console.log(`[${requestId}] Resend API call completed in ${duration}ms`)

    if (error) {
      console.error(`[${requestId}] Resend API error:`, {
        name: error.name,
        message: error.message,
        statusCode: (error as any).statusCode || 'unknown'
      })
      
      // Handle specific Resend errors
      let userMessage = 'שגיאה בשליחת האימייל'
      if (error.message?.includes('domain')) {
        userMessage = 'בעיה בתצורת המערכת'
      } else if (error.message?.includes('rate limit')) {
        userMessage = 'יותר מדי בקשות, נסו שוב בעוד דקה'
      }
      
      return NextResponse.json({ 
        error: userMessage, 
        requestId 
      }, { status: 500 })
    }

    console.log(`[${requestId}] Email sent successfully:`, {
      id: data?.id || 'unknown',
      duration: `${duration}ms`
    })
    
    return NextResponse.json({ 
      success: true, 
      emailId: data?.id,
      requestId 
    })

  } catch (error: unknown) {
    const err = error as Error
    console.error(`[${requestId}] Unexpected error:`, {
      message: err.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      type: err.constructor?.name || 'Unknown'
    })
    
    // Don't expose internal errors to client
    return NextResponse.json({ 
      error: 'שגיאה פנימית במערכת', 
      requestId 
    }, { status: 500 })
  }
}

function createEmailContent({ name, email, phone, company, message, source, subject }: {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  source: string
  subject?: string
}) {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">טופס חדש מהאתר</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${source}</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background: #f8f9ff; border-right: 4px solid #667eea; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">פרטי הלקוח</h2>
          <p style="margin: 8px 0; color: #555;"><strong>שם:</strong> ${name}</p>
          <p style="margin: 8px 0; color: #555;"><strong>אימייל:</strong> <a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
          ${phone ? `<p style="margin: 8px 0; color: #555;"><strong>טלפון:</strong> <a href="tel:${phone}" style="color: #667eea;">${phone}</a></p>` : ''}
          ${company ? `<p style="margin: 8px 0; color: #555;"><strong>חברה:</strong> ${company}</p>` : ''}
          ${subject ? `<p style="margin: 8px 0; color: #555;"><strong>נושא:</strong> ${subject}</p>` : ''}
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">הודעה</h3>
          <div style="background: #f8f9ff; padding: 15px; border-radius: 6px; line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9; text-align: center;">
          <p style="color: #777; font-size: 14px; margin: 0;">
            נשלח מהאתר בתאריך: ${new Date().toLocaleDateString('he-IL')} בשעה ${new Date().toLocaleTimeString('he-IL')}
          </p>
        </div>
      </div>
    </div>
  `
}