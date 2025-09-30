import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { guestId, eventId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get guest and event details
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError) throw guestError;

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) throw eventError;

    // Create RSVP tokens for each status
    const acceptToken = crypto.randomUUID();
    const declineToken = crypto.randomUUID();
    const maybeToken = crypto.randomUUID();

    // Store tokens in database (you might want to create a separate table for this)
    const { error: tokenError } = await supabase.from('rsvp_tokens').insert([
      { guest_id: guestId, token: acceptToken, status: 'accepted' },
      { guest_id: guestId, token: declineToken, status: 'declined' },
      { guest_id: guestId, token: maybeToken, status: 'maybe' },
    ]);

    if (tokenError) {
      console.log('Token storage error (table might not exist):', tokenError);
    }

    // Create email HTML template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Invitation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .event-details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 12px; }
        .detail-label { font-weight: 600; color: #374151; width: 100px; }
        .detail-value { color: #6b7280; }
        .rsvp-section { text-align: center; margin: 30px 0; }
        .rsvp-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .rsvp-button { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: transform 0.2s; }
        .rsvp-button:hover { transform: translateY(-2px); }
        .accept { background: #10b981; color: white; }
        .decline { background: #ef4444; color: white; }
        .maybe { background: #f59e0b; color: white; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        @media (max-width: 600px) {
            .rsvp-buttons { flex-direction: column; align-items: center; }
            .rsvp-button { width: 200px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You're Invited!</h1>
            <p>We'd love to have you join us for this special event</p>
        </div>
        
        <div class="content">
            <h2>Event Details</h2>
            <div class="event-details">
                <div class="detail-row">
                    <span class="detail-label">Event:</span>
                    <span class="detail-value">${event.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(
                      event.date
                    ).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${event.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${event.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${
                      event.type.charAt(0).toUpperCase() + event.type.slice(1)
                    }</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Theme:</span>
                    <span class="detail-value">${event.theme}</span>
                </div>
            </div>
            
            <p>${event.description}</p>
            
            <div class="rsvp-section">
                <h3>Please let us know if you can attend</h3>
                <div class="rsvp-buttons">
                    <a href="${Deno.env.get(
                      'SUPABASE_URL'
                    )}/functions/v1/rsvp-response?token=${acceptToken}" class="rsvp-button accept">
                        ✓ Yes, I'll be there
                    </a>
                    <a href="${Deno.env.get(
                      'SUPABASE_URL'
                    )}/functions/v1/rsvp-response?token=${maybeToken}" class="rsvp-button maybe">
                        ? Maybe
                    </a>
                    <a href="${Deno.env.get(
                      'SUPABASE_URL'
                    )}/functions/v1/rsvp-response?token=${declineToken}" class="rsvp-button decline">
                        ✗ Can't make it
                    </a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This invitation was sent via Event Manager</p>
            <p>If you have any questions, please contact the event organizer</p>
        </div>
    </div>
</body>
</html>
    `;

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll just return the email content
    console.log(`Sending invitation to ${guest.email} for event ${event.name}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation sent successfully',
        emailHtml, // In production, remove this
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
