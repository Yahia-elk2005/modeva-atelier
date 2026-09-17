const template = (codeOrLink, name, subject) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                background-color: #F8F9FA;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .wrapper {
                width: 100%;
                table-layout: fixed;
                background-color: #F8F9FA;
                padding: 40px 0;
            }
            .main {
                background-color: #FFFFFF;
                margin: 0 auto;
                width: 100%;
                max-width: 600px;
                border: 1px solid #E0E0E0;
            }
            .header {
                background-color: #1A1A1A;
                padding: 30px;
                text-align: center;
            }
            .logo-text {
                color: #FFFFFF;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 4px;
                text-transform: uppercase;
                margin: 0;
                font-family: Georgia, serif;
            }
            .subtitle {
                color: #008B8B;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-top: 5px;
            }
            .body-content {
                padding: 40px 30px;
                color: #333333;
                text-align: left;
            }
            .heading {
                font-size: 20px;
                font-family: Georgia, serif;
                color: #1A1A1A;
                margin-top: 0;
            }
            .text {
                font-size: 14px;
                line-height: 1.6;
                color: #666666;
                margin-bottom: 25px;
            }
            .code-box {
                background-color: #F8F9FA;
                border-left: 4px solid #008B8B;
                padding: 20px;
                text-align: center;
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 6px;
                color: #1A1A1A;
                margin: 30px 0;
            }
            .action-btn {
                display: inline-block;
                background-color: #008B8B;
                color: #FFFFFF !important;
                padding: 14px 30px;
                text-decoration: none;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                background-color: #1A1A1A;
                color: #999999;
                text-align: center;
                padding: 20px;
                font-size: 11px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <center class="wrapper">
            <table class="main" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td class="header">
                        <h1 class="logo-text">MODEVA</h1>
                        <div class="subtitle">Secure Atelier Verification</div>
                    </td>
                </tr>
                <tr>
                    <td class="body-content">
                        <h2 class="heading">${subject}</h2>
                        <p class="text">Dear ${name},</p>
                        <p class="text">Welcome to the private clientele of MODEVA. Please use the verification code or access link below to proceed with your security authorization:</p>
                        
                        <div class="code-box">
                            ${codeOrLink}
                        </div>

                        <p class="text">If you did not initiate this request, please disregard this transmission immediately or contact our atelier concierge.</p>
                    </td>
                </tr>
                <tr>
                    <td class="footer">
                        &copy; 2026 MODEVA Atelier. All rights reserved.
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `;
};

module.exports = template;