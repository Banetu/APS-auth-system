import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  name?: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to: email,
    subject: 'メールアドレスの確認',
    html: `
      <p>${name ? `${name}様` : 'お客様'}</p>
      <p>以下のリンクをクリックして、メールアドレスを確認してください。</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  });
}

export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to: email,
    subject: 'ご登録ありがとうございます',
    html: `
      <p>${name ? `${name}様` : 'お客様'}</p>
      <p>ご登録ありがとうございます。</p>
    `,
  });
}
