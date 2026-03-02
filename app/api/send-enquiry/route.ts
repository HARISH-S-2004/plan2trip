import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      city,
      destination,
      date,
      people,
      serviceInterested,
      budget,
      hotelName,
      villaName,
      requirements
    } = body;

    // Use Resend API via fetch to avoid extra dependency installation
    // User needs to add RESEND_API_KEY to their .env.local
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const subjectPrefix = hotelName ? `Hotel: ${hotelName}` : villaName ? `Villa: ${villaName}` : destination;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Plan2Trip Enquiries <onboarding@resend.dev>',
        to: 'plan2trip89@gmail.com',
        subject: `New Enquiry: ${name} - ${subjectPrefix}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0052cc; color: white; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">New Travel Enquiry</h1>
              <p style="margin: 8px 0 0; opacity: 0.8;">Plan2Trip.com - Admin Notification</p>
            </div>
            
            <div style="padding: 24px; color: #1e293b;">
              <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">Customer Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">City:</td>
                  <td style="padding: 8px 0;">${city}</td>
                </tr>
              </table>

              <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px;">Trip Requirements</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 140px;">Destination:</td>
                  <td style="padding: 8px 0;">${destination}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Date of Travel:</td>
                  <td style="padding: 8px 0;">${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Travelers:</td>
                  <td style="padding: 8px 0;">${people} People</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Interested In:</td>
                  <td style="padding: 8px 0;">${serviceInterested.replace('_', ' ').toUpperCase()}</td>
                </tr>
                ${hotelName ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0052cc;">Selected Hotel:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${hotelName}</td>
                </tr>
                ` : ''}
                ${villaName ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #0052cc;">Selected Villa:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${villaName}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Budget:</td>
                  <td style="padding: 8px 0;">${budget || 'Not specified'}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #0052cc;">
                <p style="margin: 0; font-weight: bold; margin-bottom: 8px;">Special Message:</p>
                <p style="margin: 0; line-height: 1.5;">${requirements || 'No special requirements mentioned.'}</p>
              </div>
            </div>

            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0;">This enquiry was submitted via the Plan2Trip website.</p>
              <p style="margin: 4px 0 0;">View this enquiry in your <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/bookings" style="color: #0052cc;">Admin Dashboard</a></p>
            </div>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ message: "Email sent successfully" });
    } else {
      const errorData = await response.json();
      console.error("Resend API Error:", errorData);
      return NextResponse.json({ error: "Failed to send email" }, { status: response.status });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
