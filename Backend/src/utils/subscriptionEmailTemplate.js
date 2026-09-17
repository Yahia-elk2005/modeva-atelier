const subscriptionTemplate = (name, planName, expiryDate) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { background-color: #F8F9FA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #F8F9FA; padding: 40px 0; }
            .main { background-color: #FFFFFF; margin: 0 auto; width: 100%; max-width: 600px; border: 1px solid #E0E0E0; }
            .header { background-color: #1A1A1A; padding: 30px; text-align: center; }
            .logo-text { color: #FFFFFF; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 0; font-family: Georgia, serif; }
            .subtitle { color: #008B8B; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; }
            .body-content { padding: 40px 30px; color: #333333; text-align: left; }
            .heading { font-size: 18px; font-family: Georgia, serif; color: #1A1A1A; border-bottom: 2px solid #008B8B; padding-bottom: 10px;}
            .text { font-size: 14px; line-height: 1.6; color: #666666; margin-bottom: 20px; }
            .details-box { background-color: #F8F9FA; padding: 20px; border: 1px solid #EEEEEE; margin-bottom: 20px; font-size: 13px; color: #333;}
            .footer { background-color: #1A1A1A; color: #999999; text-align: center; padding: 20px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
        </style>
    </head>
    <body>
        <center class="wrapper">
            <table class="main" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td class="header">
                        <h1 class="logo-text">MODEVA</h1>
                        <div class="subtitle">Atelier Membership Privilege</div>
                    </td>
                </tr>
                <tr>
                    <td class="body-content">
                        <h2 class="heading">Welcome to ${planName}</h2>
                        <p class="text">Dear ${name},</p>
                        <p class="text">Your private clientele membership has been successfully activated. You now have full access to exclusive atelier privileges, white-glove courier services, and private collections.</p>
                        <div class="details-box">
                            <strong>Membership Tier:</strong> ${planName}<br>
                            <strong>Valid Until:</strong> ${expiryDate}
                        </div>
                        <p class="text">Thank you for trusting Modeva Atelier.</p>
                    </td>
                </tr>
                <tr>
                    <td class="footer">&copy; 2026 MODEVA Atelier. All rights reserved.</td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `;
};

module.exports = subscriptionTemplate;