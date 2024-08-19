using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace BusinessLayer
{
    public class EmailService
    {
        public async Task<Response> OtpEmail(string email, int otp)
        {
            var apiKey = Environment.GetEnvironmentVariable("PHOENIX_GYM_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("phoenixgym2024@gmail.com", "Phoenix Gym");
            var subject = "Codigo OTP";
            var to = new EmailAddress(email);
            var plainTextContent = "";
            var htmlContent = $@"
    <!DOCTYPE html>
    <html lang=""es"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Su código OTP</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
            }}
            .header img {{
                max-width: 100px;
            }}
            .content {{
                padding: 20px 0;
                text-align: center;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #F77F00;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                font-size: 12px;
                color: #888;
            }}
        </style>
    </head>
    <body>
        <div class=""container"">
            <div class=""header"">
                <img src=""http://res.cloudinary.com/dmyijnjqd/image/upload/v1720622506/qne85cbyddsmlsenlpzw.png"" alt=""Company Logo"">
            </div>
            <div class=""content"">
                <h1>Código OTP</h1>
                <div class=""otp-code"">{otp}</div>
            </div>
            <div class=""footer"">
                <p>Phoenix Gym</p>
            </div>
        </div>
    </body>
    </html>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return response;
        }

        public async Task<Response> ResetPasswordEmail(string email, string resetLink)
        {
            var apiKey = Environment.GetEnvironmentVariable("PHOENIX_GYM_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("phoenixgym2024@gmail.com", "Phoenix Gym");
            var subject = "Reestablecer Contraseña";
            var to = new EmailAddress(email);
            var plainTextContent = "";
            var htmlContent = $@"
    <!DOCTYPE html>
    <html lang=""es"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Su código OTP</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding: 20px 0;
            }}
            .header img {{
                max-width: 100px;
            }}
            .content {{
                padding: 20px 0;
                text-align: center;
            }}
            .reset-link {{
                font-size: 24px;
                font-weight: bold;
                color: #F77F00;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px 0;
                font-size: 12px;
                color: #888;
            }}
        </style>
    </head>
    <body>
        <div class=""container"">
            <div class=""header"">
                <img src=""http://res.cloudinary.com/dmyijnjqd/image/upload/v1720622506/qne85cbyddsmlsenlpzw.png""
alt=""Company Logo"">
            </div>
            <div class=""content"">
                <h1> Reestablecer Contraseña </h1>
                <div div class=""reset-link"">
                    <a href = {resetLink}>Click aquí para reestablecer su contraseña</a>
                </div>
            </div>
            <div class=""footer"">
                <p>Phoenix Gym</p>
            </div>
        </div>
    </body>
    </html>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return response;
        }
    }
}
