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

def html_content_appointment_confirmed(student_name: str, counselor_name: str, appointment_date: str, meeting_link: str = "#") -> str:
    """
    HTML email template for confirmed appointment.
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmed</title>
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
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .content {{
                padding: 30px;
            }}
            .appointment-details {{
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }}
            .detail-item {{
                margin: 10px 0;
                display: flex;
                align-items: center;
            }}
            .detail-item i {{
                margin-right: 10px;
                color: #28a745;
            }}
            .button {{
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
                font-weight: bold;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Appointment Confirmed!</h1>
                <p>Your counseling session has been confirmed</p>
            </div>
            <div class="content">
                <h2>Hello {student_name},</h2>
                <p>Great news! Your appointment with <strong>{counselor_name}</strong> has been confirmed.</p>
                
                <div class="appointment-details">
                    <h3>📅 Appointment Details</h3>
                    <div class="detail-item">
                        <strong>Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item">
                        <strong>Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span>
                    </div>
                </div>
                
                <p>Please make sure to:</p>
                <ul>
                    <li>Join the meeting on time</li>
                    <li>Have any relevant documents ready</li>
                    <li>Prepare questions you'd like to discuss</li>
                </ul>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="{meeting_link}" class="button">Join Meeting</a>
                </div>
                
                <p>If you need to reschedule or have any questions, please contact us in advance.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Counseling Team</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """


def html_content_appointment_cancelled(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for cancelled appointment.
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancelled</title>
        <style>
            body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }}
            .container {{ background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; }}
            .appointment-details {{ background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545; }}
            .button {{ display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }}
            .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ Appointment Cancelled</h1>
                <p>Your counseling session has been cancelled</p>
            </div>
            <div class="content">
                <h2>Hello {student_name},</h2>
                <p>We're writing to inform you that your appointment with <strong>{counselor_name}</strong> has been cancelled.</p>
                
                <div class="appointment-details">
                    <h3>📅 Cancelled Appointment</h3>
                    <div class="detail-item">
                        <strong>Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item">
                        <strong>Original Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">Cancelled</span>
                    </div>
                </div>
                
                <p>We apologize for any inconvenience this may cause. You can schedule a new appointment at your convenience.</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="#" class="button">Schedule New Appointment</a>
                </div>
                
                <p>If you have any questions about this cancellation, please don't hesitate to contact us.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Counseling Team</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """


def html_content_appointment_completed(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for completed appointment.
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Completed</title>
        <style>
            body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }}
            .container {{ background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; }}
            .appointment-details {{ background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #17a2b8; }}
            .button {{ display: inline-block; background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }}
            .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Session Completed</h1>
                <p>Your counseling session has been completed</p>
            </div>
            <div class="content">
                <h2>Hello {student_name},</h2>
                <p>Your appointment with <strong>{counselor_name}</strong> has been marked as completed.</p>
                
                <div class="appointment-details">
                    <h3>📅 Completed Session</h3>
                    <div class="detail-item">
                        <strong>Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item">
                        <strong>Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span style="color: #17a2b8; font-weight: bold;">Completed</span>
                    </div>
                </div>
                
                <p>We hope your session was helpful and informative. Your feedback is valuable to us!</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <a href="#" class="button">Provide Feedback</a>
                </div>
                
                <p>If you'd like to schedule another session or have any follow-up questions, we're here to help.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Counseling Team</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """


def html_content_appointment_pending(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for pending appointment.
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Pending</title>
        <style>
            body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }}
            .container {{ background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
            .header {{ background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; }}
            .appointment-details {{ background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107; }}
            .footer {{ text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏳ Appointment Pending</h1>
                <p>Your counseling session is awaiting confirmation</p>
            </div>
            <div class="content">
                <h2>Hello {student_name},</h2>
                <p>Your appointment request with <strong>{counselor_name}</strong> is currently pending confirmation.</p>
                
                <div class="appointment-details">
                    <h3>📅 Requested Appointment</h3>
                    <div class="detail-item">
                        <strong>Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item">
                        <strong>Requested Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Confirmation</span>
                    </div>
                </div>
                
                <p>The counselor will review your request and confirm the appointment soon. You will receive another email once the appointment is confirmed.</p>
                
                <p>If you have any urgent questions, please feel free to contact our support team.</p>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Counseling Team</strong></p>
                    <p><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """