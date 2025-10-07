def html_content_account_creation(password: str, user_name: str = "User") -> str:
    """
    HTML email template for account creation.
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Created Successfully</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .content {{
                padding: 30px;
            }}
            .password-box {{
                background: #f8f9fa;
                border: 2px dashed #667eea;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                color: #333;
                border-radius: 5px;
            }}
            .warning {{
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 14px;
            }}
            .button {{
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
            }}
            .security-note {{
                background: #e7f3ff;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Our Platform!</h1>
                <p>Your account has been successfully created</p>
            </div>
            <div class="content">
                <h2>Hello {user_name},</h2>
                <p>Thank you for joining our platform. We're excited to have you on board!</p>
                
                <div class="security-note">
                    <h3>🔐 Your Login Credentials</h3>
                    <p>Use the following temporary password to log in to your account:</p>
                </div>
                
                <div class="password-box">
                    Temporary Password:<br>
                    <span style="color: #667eea; font-size: 20px; letter-spacing: 2px;">{password}</span>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important Security Notice:</strong><br>
                    For your account security, please change your password immediately after logging in for the first time.
                </div>
                
                <p>To get started with your account:</p>
                <ol>
                    <li>Go to our platform login page</li>
                    <li>Enter your email address</li>
                    <li>Use the temporary password above</li>
                    <li>Navigate to your profile settings to change your password</li>
                </ol>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="#" class="button">Login to Your Account</a>
                </div>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Platform Team</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """