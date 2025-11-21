import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const {apiKey, fromEmail} = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

export async function sendCredentialEmail(
  toEmail: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const fullName = `${firstName} ${lastName}`;
    
    await client.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Your HRMS Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1965ae;">Welcome to HRMS</h2>
          <p>Hello ${fullName},</p>
          <p>Your account has been created in the Human Resource Management System. Below are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p>Please keep these credentials safe and change your password after your first login.</p>
          <p>You can access the system at: <a href="${process.env.REPLIT_DEV_DOMAIN || 'your-domain.com'}" style="color: #1965ae;">Login Here</a></p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send credential email:', error);
    return { success: false, error };
  }
}
