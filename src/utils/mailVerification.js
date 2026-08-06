import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: "mjunaidahmad7025@gmail.com",
        pass: "gwmwfyhgnmrcbfqd",
      },
    });

export default async function sendEmail(email){
  try {
    await transporter.verify();
    
    
    let OTP = (Math.random() * 900000);
    OTP = Math.floor(OTP)
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Email Verification",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: #4F46E5;
          color: white;
          text-align: center;
          padding: 30px;
        }
        .content {
          padding: 30px;
          color: #333;
          line-height: 1.6;
        }
        .otp-box {
          background: #f8f9ff;
          border: 2px dashed #4F46E5;
          color: #4F46E5;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          letter-spacing: 8px;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
        }
        .footer {
          text-align: center;
          color: #777;
          font-size: 12px;
          padding: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Library Management System</h1>
        </div>

        <div class="content">
          <h2>Email Verification</h2>

          <p>Hello,</p>

          <p>
            Use the following One-Time Password (OTP) to verify your email
            address.
          </p>

          <div class="otp-box">
            ${OTP}
          </div>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p>
            If you didn't request this code, you can safely ignore this email.
          </p>

          <p>
            Thanks,<br>
            <strong>Your App Team</strong>
          </p>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </div>
      </div>
    </body>
    </html>
 `,

    });

    console.log("email sent sucessfully" , OTP);
    return OTP;
  } catch (error) {
    console.log(error, "email not sent");
  }
};

