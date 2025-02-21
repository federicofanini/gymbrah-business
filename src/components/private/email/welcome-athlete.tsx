"use server";

import { resend } from "@/utils/email/client";

interface WelcomeAthleteEmailProps {
  athleteEmail: string;
  athleteName: string;
  athleteCode: string;
}

export async function sendWelcomeAthleteEmail({
  athleteEmail,
  athleteName,
  athleteCode,
}: WelcomeAthleteEmailProps) {
  try {
    await resend.emails.send({
      from: "GymBrah <noreply@mail.gymbrah.com>",
      to: athleteEmail,
      subject: "Welcome to GymBrah! 🎉",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827;">Welcome to GymBrah, ${athleteName}!</h1>
          
          <p style="color: #374151; line-height: 1.5;">
            You've been invited to join GymBrah. We're excited to have you on board!
          </p>

          <p style="color: #374151; line-height: 1.5;">
            Your unique athlete code is: <strong style="color: #111827;">${athleteCode}</strong>
          </p>

          <p style="color: #374151; line-height: 1.5;">
            You can use this code to log in to the GymBrah app and access your training programs, track your progress, and connect with your trainer.
          </p>

          <div style="margin: 32px 0;">
            <a 
              href="https://athlete.gymbrah.com/login?athlete_code=${athleteCode}" 
              style="background-color: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;"
            >
              Get Started
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please don't hesitate to reach out to your trainer or contact our support team.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            You are receiving this email because you were invited from your gym or trainer to join GymBrah. If you do not want to receive these emails, please contact your administrator.
          </p>
        </div>
      `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    console.error("Error details:", {
      athleteEmail,
      athleteName,
      athleteCode,
      error,
    });
    return {
      success: false,
      error: "Failed to send welcome email",
    };
  }
}
