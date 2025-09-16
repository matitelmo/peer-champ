/**
 * Email Service
 *
 * Provides functions for sending emails including meeting notifications,
 * calendar invites, and other system communications.
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface MeetingNotificationData {
  meetingTitle: string;
  meetingLink: string;
  scheduledAt: string;
  duration: number;
  hostName?: string;
  hostEmail?: string;
  prospectName?: string;
  prospectEmail?: string;
  prospectCompany?: string;
  advocateName?: string;
  advocateEmail?: string;
  advocateCompany?: string;
  salesRepName?: string;
  salesRepEmail?: string;
  timezone?: string;
  meetingDescription?: string;
}

export interface CalendarInviteData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  attendees: EmailRecipient[];
  organizer: EmailRecipient;
  timezone?: string;
}

/**
 * Generate meeting notification email template
 */
export function generateMeetingNotificationEmail(
  data: MeetingNotificationData,
  recipientType: 'prospect' | 'advocate' | 'sales_rep'
): EmailTemplate {
  const { 
    meetingTitle, 
    meetingLink, 
    scheduledAt, 
    duration, 
    timezone = 'UTC',
    meetingDescription 
  } = data;

  const meetingDate = new Date(scheduledAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const meetingTime = new Date(scheduledAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  });

  const durationText = duration === 60 ? '1 hour' : `${duration} minutes`;

  let subject = '';
  let content = '';

  switch (recipientType) {
    case 'prospect':
      subject = `Reference Call Scheduled: ${meetingTitle}`;
      content = `
        <p>Hello ${data.prospectName || 'there'},</p>
        
        <p>We're excited to connect you with one of our customer advocates for a reference call!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1d3557;">Meeting Details</h3>
          <p><strong>Title:</strong> ${meetingTitle}</p>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime} (${timezone})</p>
          <p><strong>Duration:</strong> ${durationText}</p>
          ${meetingDescription ? `<p><strong>Description:</strong> ${meetingDescription}</p>` : ''}
          <p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #e63946;">Join Meeting</a></p>
        </div>
        
        <p>Please join the meeting using the link above. If you have any questions, feel free to reach out.</p>
        
        <p>Best regards,<br>
        ${data.salesRepName || 'The PeerChamps Team'}</p>
      `;
      break;

    case 'advocate':
      subject = `Reference Call Scheduled: ${meetingTitle}`;
      content = `
        <p>Hello ${data.advocateName || 'there'},</p>
        
        <p>Thank you for agreeing to participate in a reference call! We have a prospect who would love to hear about your experience.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1d3557;">Meeting Details</h3>
          <p><strong>Title:</strong> ${meetingTitle}</p>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime} (${timezone})</p>
          <p><strong>Duration:</strong> ${durationText}</p>
          <p><strong>Prospect:</strong> ${data.prospectName} (${data.prospectCompany})</p>
          ${meetingDescription ? `<p><strong>Description:</strong> ${meetingDescription}</p>` : ''}
          <p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #e63946;">Join Meeting</a></p>
        </div>
        
        <p>Please join the meeting using the link above. Thank you for your time and expertise!</p>
        
        <p>Best regards,<br>
        ${data.salesRepName || 'The PeerChamps Team'}</p>
      `;
      break;

    case 'sales_rep':
      subject = `Reference Call Scheduled: ${meetingTitle}`;
      content = `
        <p>Hello ${data.salesRepName || 'there'},</p>
        
        <p>Your reference call has been successfully scheduled!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1d3557;">Meeting Details</h3>
          <p><strong>Title:</strong> ${meetingTitle}</p>
          <p><strong>Date:</strong> ${meetingDate}</p>
          <p><strong>Time:</strong> ${meetingTime} (${timezone})</p>
          <p><strong>Duration:</strong> ${durationText}</p>
          <p><strong>Prospect:</strong> ${data.prospectName} (${data.prospectCompany})</p>
          <p><strong>Advocate:</strong> ${data.advocateName} (${data.advocateCompany})</p>
          ${meetingDescription ? `<p><strong>Description:</strong> ${meetingDescription}</p>` : ''}
          <p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #e63946;">Join Meeting</a></p>
        </div>
        
        <p>The meeting link has been shared with all participants. Good luck with your reference call!</p>
        
        <p>Best regards,<br>
        The PeerChamps Team</p>
      `;
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1d3557; margin: 0;">PeerChamps</h1>
      </div>
      
      ${content}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This email was sent from PeerChamps. If you have any questions, please contact support.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${subject}
    
    ${content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}
    
    ---
    This email was sent from PeerChamps.
  `;

  return { subject, html, text };
}

/**
 * Generate iCalendar invite content
 */
export function generateCalendarInvite(data: CalendarInviteData): string {
  const {
    title,
    description,
    startTime,
    endTime,
    location,
    meetingLink,
    attendees,
    organizer,
    timezone = 'UTC'
  } = data;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Format dates for iCalendar (UTC format)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const attendeesList = attendees.map(attendee => 
    `ATTENDEE;CN=${attendee.name || attendee.email}:mailto:${attendee.email}`
  ).join('\n');

  const locationText = location || meetingLink || '';

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PeerChamps//Meeting Invite//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@peerchamps.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${locationText}
ORGANIZER;CN=${organizer.name || organizer.email}:mailto:${organizer.email}
${attendeesList}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder
TRIGGER:-PT15M
END:VALARM
END:VEVENT
END:VCALENDAR`;
}

/**
 * Send email (mock implementation for MVP)
 * In production, this would integrate with SendGrid, AWS SES, or similar
 */
export async function sendEmail(
  to: EmailRecipient | EmailRecipient[],
  template: EmailTemplate,
  from?: EmailRecipient
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Mock email sending for MVP
    console.log('📧 Email would be sent:', {
      to: Array.isArray(to) ? to.map(r => r.email) : [to.email],
      subject: template.subject,
      from: from?.email || 'noreply@peerchamps.com',
    });

    // In production, this would be:
    // const response = await sendgrid.send({
    //   to: Array.isArray(to) ? to.map(r => r.email) : [to.email],
    //   from: from?.email || 'noreply@peerchamps.com',
    //   subject: template.subject,
    //   html: template.html,
    //   text: template.text,
    // });

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send meeting notifications to all participants
 */
export async function sendMeetingNotifications(
  data: MeetingNotificationData
): Promise<{ success: boolean; results: Array<{ recipient: string; success: boolean; error?: string }> }> {
  const results: Array<{ recipient: string; success: boolean; error?: string }> = [];

  // Send to prospect
  if (data.prospectEmail) {
    const prospectTemplate = generateMeetingNotificationEmail(data, 'prospect');
    const result = await sendEmail(
      { email: data.prospectEmail, name: data.prospectName },
      prospectTemplate,
      { email: data.salesRepEmail || 'noreply@peerchamps.com', name: data.salesRepName }
    );
    
    results.push({
      recipient: `prospect:${data.prospectEmail}`,
      success: result.success,
      error: result.error,
    });
  }

  // Send to advocate
  if (data.advocateEmail) {
    const advocateTemplate = generateMeetingNotificationEmail(data, 'advocate');
    const result = await sendEmail(
      { email: data.advocateEmail, name: data.advocateName },
      advocateTemplate,
      { email: data.salesRepEmail || 'noreply@peerchamps.com', name: data.salesRepName }
    );
    
    results.push({
      recipient: `advocate:${data.advocateEmail}`,
      success: result.success,
      error: result.error,
    });
  }

  // Send to sales rep
  if (data.salesRepEmail) {
    const salesRepTemplate = generateMeetingNotificationEmail(data, 'sales_rep');
    const result = await sendEmail(
      { email: data.salesRepEmail, name: data.salesRepName },
      salesRepTemplate,
      { email: 'noreply@peerchamps.com', name: 'PeerChamps' }
    );
    
    results.push({
      recipient: `sales_rep:${data.salesRepEmail}`,
      success: result.success,
      error: result.error,
    });
  }

  const allSuccessful = results.every(r => r.success);

  return {
    success: allSuccessful,
    results,
  };
}

/**
 * Send calendar invite
 */
export async function sendCalendarInvite(
  data: CalendarInviteData,
  to: EmailRecipient | EmailRecipient[]
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const calendarContent = generateCalendarInvite(data);
    
    // Create email template with calendar attachment
    const template: EmailTemplate = {
      subject: `Meeting Invitation: ${data.title}`,
      html: `
        <p>You have been invited to a meeting.</p>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Date:</strong> ${new Date(data.startTime).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(data.startTime).toLocaleTimeString()}</p>
        ${data.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">Join Meeting</a></p>` : ''}
        <p>Please add this event to your calendar.</p>
      `,
      text: `Meeting Invitation: ${data.title}\n\nPlease add this event to your calendar.`,
    };

    // In production, this would attach the calendar file
    console.log('📅 Calendar invite would be sent:', {
      to: Array.isArray(to) ? to.map(r => r.email) : [to.email],
      calendarContent: calendarContent.substring(0, 100) + '...',
    });

    return {
      success: true,
      messageId: `calendar-${Date.now()}`,
    };
  } catch (error) {
    console.error('Calendar invite sending failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
