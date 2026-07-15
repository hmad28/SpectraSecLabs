const resendFrom = process.env.RESEND_FROM_EMAIL || "SpectraSec Labs <onboarding@resend.dev>";

type OtpKind = "sign-in" | "email-verification" | "forget-password" | "change-email";

type AuthOtpEmail = {
  email: string;
  otp: string;
  type: OtpKind;
};

function subjectFor(type: OtpKind) {
  switch (type) {
    case "email-verification": return "Verify your SpectraSec Labs account";
    case "forget-password": return "Reset your SpectraSec Labs password";
    case "change-email": return "Confirm your new SpectraSec Labs email";
    case "sign-in": return "Your SpectraSec Labs sign-in code";
    default: return "SpectraSec Labs security code";
  }
}

function copyFor(type: OtpKind, otp: string) {
  const label = type === "forget-password" ? "password reset" : type === "change-email" ? "email change" : type === "email-verification" ? "email verification" : "sign-in";
  return {
    text: `Your SpectraSec Labs ${label} code is ${otp}. This code expires soon. If you did not request it, ignore this email.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#eae5ff;background:#0b0814;padding:24px">
        <div style="max-width:560px;margin:0 auto;padding:28px;border:1px solid #34254c;background:#120d1c">
          <p style="margin:0 0 12px;color:#8be9ff;font-size:12px;letter-spacing:.12em;text-transform:uppercase">SpectraSec Labs</p>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.1">${subjectFor(type)}</h1>
          <p style="margin:0 0 18px;color:#d3cbef">Use this one-time code to complete your ${label} flow.</p>
          <div style="display:inline-block;padding:14px 18px;border:1px solid #6d4cff;background:#1a1227;font-size:32px;font-weight:800;letter-spacing:.18em">${otp}</div>
          <p style="margin:18px 0 0;color:#8f89a8;font-size:13px">This code expires automatically. If you did not request it, you can ignore this email.</p>
        </div>
      </div>
    `,
  };
}

export async function sendAuthOtpEmail({ email, otp, type }: AuthOtpEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const message = "RESEND_API_KEY is required to send auth OTP emails";
    if (process.env.NODE_ENV === "production") throw new Error(message);
    console.warn(message);
    return;
  }

  const payload = {
    from: resendFrom,
    to: [email],
    subject: subjectFor(type),
    text: copyFor(type, otp).text,
    html: copyFor(type, otp).html,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Resend email failed: ${response.status} ${details}`.trim());
  }
}
