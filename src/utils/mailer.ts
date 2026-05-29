import nodemailer from 'nodemailer';

export const sendVerificationEmail = async ({
  email,
  name,
  url,
}: {
  email: string;
  name: string;
  url: string;
}) => {
  const host = process.env.SMTP_SERVER;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || 'no-reply@ringkas.polida.ac.id';

  if (!host || !user || !pass) {
    console.error('SMTP configuration missing in environment variables');
    throw new Error('Email sending is not configured properly.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email Uangku</title>
  <style>
    body {
      font-family: 'Poppins', 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #E0E5EC;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #E0E5EC;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #E0E5EC;
      border-radius: 28px;
      padding: 40px;
      box-sizing: border-box;
      box-shadow: 8px 8px 16px #BEC3C9, -8px -8px 16px #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .logo-container {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo-box {
      display: inline-block;
      width: 56px;
      height: 56px;
      line-height: 56px;
      border-radius: 16px;
      background-color: #E0E5EC;
      box-shadow: 4px 4px 8px #BEC3C9, -4px -4px 8px #FFFFFF;
      font-size: 28px;
      text-align: center;
    }
    .app-title {
      font-size: 22px;
      font-weight: 800;
      color: #2D3748;
      margin-top: 12px;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }
    .app-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #6C63FF;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
    }
    .content {
      color: #2D3748;
      font-size: 14px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #2D3748;
      margin-bottom: 16px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background-color: #6C63FF;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-radius: 18px;
      box-shadow: 4px 4px 8px #544cd9, -4px -4px 8px #847aff;
      transition: all 0.2s ease;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(113, 128, 150, 0.2);
      text-align: center;
      font-size: 11px;
      color: #718096;
      font-weight: 500;
      line-height: 1.5;
    }
    .footer a {
      color: #6C63FF;
      text-decoration: none;
      font-weight: 700;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 20px;
      background-color: #E0E5EC;
      box-shadow: inset 2px 2px 4px #BEC3C9, inset -2px -2px 4px #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      color: #6C63FF;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .link-backup {
      font-size: 11px;
      color: #718096;
      word-break: break-all;
      background-color: #E0E5EC;
      padding: 12px;
      border-radius: 12px;
      box-shadow: inset 1px 1px 2px #BEC3C9, inset -1px -1px 2px #FFFFFF;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="logo-container">
        <div class="logo-box">💸</div>
        <h1 class="app-title">Uangku</h1>
        <p class="app-subtitle">Personal Finance</p>
      </div>

      <div class="content">
        <div style="text-align: center;">
          <span class="badge">✨ Verifikasi Akun</span>
        </div>
        
        <p class="greeting">Halo ${name},</p>
        <p>Terima kasih telah bergabung di <strong>Uangku</strong>! Kami sangat bersemangat membantu Anda dalam melacak transaksi finansial bulanan, menetapkan target tabungan, dan mencapai kebebasan finansial.</p>
        <p>Sebelum memulai petualangan finansial Anda, silakan klik tombol di bawah ini untuk memverifikasi alamat email dan mengaktifkan akun Anda:</p>
        
        <div class="btn-container">
          <a href="${url}" class="btn" target="_blank">Verifikasi Email Saya</a>
        </div>
        
        <p>Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin dan menempelkan tautan berikut ke peramban (browser) Anda:</p>
        <div class="link-backup">
          <a href="${url}" style="color: #6C63FF; text-decoration: none;">${url}</a>
        </div>
        
        <p style="margin-top: 25px; font-size: 12px; color: #718096; font-style: italic;">Link verifikasi ini berlaku selama 24 jam. Jika Anda tidak merasa mendaftar di Uangku, Anda dapat mengabaikan email ini dengan aman.</p>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear().toString()} Uangku Team. All rights reserved.<br>
        Kelola keuangan pribadi Anda secara instan dengan desain Soft UI yang modern.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Uangku" <${from}>`,
    to: email,
    subject: 'Verifikasi Email Akun Uangku Anda 💸',
    html: htmlContent,
  });
};
