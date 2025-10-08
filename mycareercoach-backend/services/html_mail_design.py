def html_content_account_creation(password: str, user_name: str = "User") -> str:
    """
    HTML email template for account creation - Updated with brand colors
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
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .password-box {{
                background: #f8f9fa;
                border: 2px dashed #c92a2a;
                padding: 20px;
                margin: 25px 0;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                color: #002B5B;
                border-radius: 8px;
            }}
            .warning {{
                background: #fff3f3;
                border: 1px solid #ffcdd2;
                color: #c92a2a;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #c92a2a;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
            .button {{
                display: inline-block;
                background: #c92a2a;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 25px;
                margin: 15px 0;
                font-weight: bold;
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #b02525;
                transform: translateY(-2px);
            }}
            .security-note {{
                background: #f0f7ff;
                border-left: 4px solid #002B5B;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎉 Welcome to MyCareerCoach!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your account has been successfully created</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {user_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">Thank you for joining MyCareerCoach! We're excited to help you turn academic decisions into career success.</p>
                
                <div class="security-note">
                    <h3 style="color: #002B5B; margin-top: 0;">🔐 Your Login Credentials</h3>
                    <p style="color: #002B5B; margin-bottom: 10px;">Use the following temporary password to log in to your account:</p>
                </div>
                
                <div class="password-box">
                    Temporary Password:<br>
                    <span style="color: #c92a2a; font-size: 22px; letter-spacing: 2px; font-family: 'Courier New', monospace;">{password}</span>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important Security Notice:</strong><br>
                    For your account security, please change your password immediately after logging in for the first time.
                </div>
                
                <p style="color: #002B5B;"><strong>To get started with your account:</strong></p>
                <ol style="color: #002B5B; padding-left: 20px;">
                    <li>Go to the MyCareerCoach login page</li>
                    <li>Enter your email address</li>
                    <li>Use the temporary password above</li>
                    <li>Navigate to your profile settings to change your password</li>
                </ol>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">Login to Your Account</a>
                </div>
                
                <p style="color: #002B5B;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_appointment_confirmed(student_name: str, counselor_name: str, appointment_date: str, meeting_link: str = "#") -> str:
    """
    HTML email template for confirmed appointment - Updated with brand colors
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
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .appointment-details {{
                background: #f0f7ff;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #002B5B;
            }}
            .detail-item {{
                margin: 12px 0;
                display: flex;
                align-items: center;
                color: #002B5B;
            }}
            .button {{
                display: inline-block;
                background: #c92a2a;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 25px;
                margin: 15px 0;
                font-weight: bold;
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #b02525;
                transform: translateY(-2px);
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">✅ Appointment Confirmed!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your counseling session has been confirmed</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {student_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">Great news! Your appointment with <strong>{counselor_name}</strong> has been confirmed.</p>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">📅 Appointment Details</h3>
                    <div class="detail-item">
                        <strong style="min-width: 100px;">Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item">
                        <strong style="min-width: 100px;">Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item">
                        <strong style="min-width: 100px;">Status:</strong> 
                        <span style="color: #c92a2a; font-weight: bold; background: #fff3f3; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Confirmed
                        </span>
                    </div>
                </div>
                
                <p style="color: #002B5B;"><strong>Please make sure to:</strong></p>
                <ul style="color: #002B5B; padding-left: 20px;">
                    <li>Join the meeting on time</li>
                    <li>Have any relevant documents ready</li>
                    <li>Prepare questions you'd like to discuss</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{meeting_link}" class="button">Join Meeting</a>
                </div>
                
                <p style="color: #002B5B;">If you need to reschedule or have any questions, please contact us in advance.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_appointment_cancelled(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for cancelled appointment - Updated with brand colors
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Cancelled</title>
        <style>
            body {{ 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #002B5B; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f8fafc; 
            }}
            .container {{ 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1); 
            }}
            .header {{ 
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }}
            .content {{ 
                padding: 40px 30px; 
            }}
            .appointment-details {{ 
                background: #fff3f3; 
                border-radius: 8px; 
                padding: 25px; 
                margin: 25px 0; 
                border-left: 4px solid #c92a2a; 
            }}
            .button {{ 
                display: inline-block; 
                background: #002B5B; 
                color: white; 
                padding: 14px 35px; 
                text-decoration: none; 
                border-radius: 25px; 
                margin: 15px 0; 
                font-weight: bold; 
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #001f3f;
                transform: translateY(-2px);
            }}
            .footer {{ 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 1px solid #e2e8f0; 
                color: #666; 
                font-size: 14px; 
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">❌ Appointment Cancelled</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your counseling session has been cancelled</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {student_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">We're writing to inform you that your appointment with <strong>{counselor_name}</strong> has been cancelled.</p>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">📅 Cancelled Appointment</h3>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 120px;">Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 120px;">Original Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 120px;">Status:</strong> 
                        <span style="color: #c92a2a; font-weight: bold; background: #fff3f3; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Cancelled
                        </span>
                    </div>
                </div>
                
                <p style="color: #002B5B;">We apologize for any inconvenience this may cause. You can schedule a new appointment at your convenience.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">Schedule New Appointment</a>
                </div>
                
                <p style="color: #002B5B;">If you have any questions about this cancellation, please don't hesitate to contact us.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_appointment_completed(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for completed appointment - Updated with brand colors
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Completed</title>
        <style>
            body {{ 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #002B5B; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f8fafc; 
            }}
            .container {{ 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1); 
            }}
            .header {{ 
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }}
            .content {{ 
                padding: 40px 30px; 
            }}
            .appointment-details {{ 
                background: #f0f7ff; 
                border-radius: 8px; 
                padding: 25px; 
                margin: 25px 0; 
                border-left: 4px solid #002B5B; 
            }}
            .button {{ 
                display: inline-block; 
                background: #c92a2a; 
                color: white; 
                padding: 14px 35px; 
                text-decoration: none; 
                border-radius: 25px; 
                margin: 15px 0; 
                font-weight: bold; 
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #b02525;
                transform: translateY(-2px);
            }}
            .footer {{ 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 1px solid #e2e8f0; 
                color: #666; 
                font-size: 14px; 
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">✅ Session Completed</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your counseling session has been completed</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {student_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">Your appointment with <strong>{counselor_name}</strong> has been marked as completed.</p>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">📅 Completed Session</h3>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Status:</strong> 
                        <span style="color: #c92a2a; font-weight: bold; background: #fff3f3; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Completed
                        </span>
                    </div>
                </div>
                
                <p style="color: #002B5B;">We hope your session was helpful and informative. Your feedback is valuable to us!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">Provide Feedback</a>
                </div>
                
                <p style="color: #002B5B;">If you'd like to schedule another session or have any follow-up questions, we're here to help.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_appointment_pending(student_name: str, counselor_name: str, appointment_date: str) -> str:
    """
    HTML email template for pending appointment - Updated with brand colors
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Pending</title>
        <style>
            body {{ 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #002B5B; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background-color: #f8fafc; 
            }}
            .container {{ 
                background: white; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1); 
            }}
            .header {{ 
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }}
            .content {{ 
                padding: 40px 30px; 
            }}
            .appointment-details {{ 
                background: #fffbf0; 
                border-radius: 8px; 
                padding: 25px; 
                margin: 25px 0; 
                border-left: 4px solid #ffc107; 
            }}
            .footer {{ 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 30px; 
                border-top: 1px solid #e2e8f0; 
                color: #666; 
                font-size: 14px; 
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">⏳ Appointment Pending</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your counseling session is awaiting confirmation</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {student_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">Your appointment request with <strong>{counselor_name}</strong> is currently pending confirmation.</p>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">📅 Requested Appointment</h3>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Counselor:</strong> {counselor_name}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Requested Date & Time:</strong> {appointment_date}
                    </div>
                    <div class="detail-item" style="margin: 12px 0; color: #002B5B;">
                        <strong style="min-width: 100px;">Status:</strong> 
                        <span style="color: #e67700; font-weight: bold; background: #fff3e0; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Pending Confirmation
                        </span>
                    </div>
                </div>
                
                <p style="color: #002B5B;">The counselor will review your request and confirm the appointment soon. You will receive another email once the appointment is confirmed.</p>
                
                <p style="color: #002B5B;">If you have any urgent questions, please feel free to contact our support team.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_account_suspended(user_name: str, user_role: str = "user") -> str:
    """
    HTML email template for account suspension - Updated with brand colors
    """
    role_display = user_role.title()
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Suspension Notice</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .warning-box {{
                background: #fff3f3;
                border: 1px solid #ffcdd2;
                color: #c92a2a;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #c92a2a;
            }}
            .details-box {{
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
            }}
            .contact-info {{
                background: #f0f7ff;
                border-left: 4px solid #002B5B;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">⚠️ Account Suspended</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Important Notice Regarding Your Account</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {user_name},</h2>
                
                <div class="warning-box">
                    <h3 style="color: #c92a2a; margin-top: 0;">🚫 Account Suspension Notice</h3>
                    <p style="color: #c92a2a; margin-bottom: 0;">Your {role_display} account has been temporarily suspended effective immediately.</p>
                </div>
                
                <div class="details-box">
                    <h3 style="color: #002B5B; margin-top: 0;">📋 Account Details</h3>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>User:</strong> {user_name}
                    </div>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>Role:</strong> {role_display}
                    </div>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>Status:</strong> 
                        <span style="color: #c92a2a; font-weight: bold; background: #fff3f3; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Suspended
                        </span>
                    </div>
                </div>
                
                <h3 style="color: #002B5B;">What This Means:</h3>
                <ul style="color: #002B5B; padding-left: 20px;">
                    <li>You cannot log in to your account during the suspension period</li>
                    <li>All account functionalities are temporarily disabled</li>
                    <li>Any scheduled appointments or activities may be affected</li>
                </ul>
                
                <div class="contact-info">
                    <h3 style="color: #002B5B; margin-top: 0;">📞 Need Assistance?</h3>
                    <p style="color: #002B5B;">If you believe this suspension was made in error, or if you have questions about your account status, please contact our support team immediately.</p>
                    <p style="color: #002B5B;"><strong>Support Email:</strong> support@mycareercoach.com</p>
                </div>
                
                <p style="color: #002B5B;">We take account security and platform integrity seriously. Thank you for your understanding.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">MyCareerCoach Administration Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
def html_content_account_reactivated(user_name: str, user_role: str = "user") -> str:
    """
    HTML email template for account reactivation - Updated with brand colors
    """
    role_display = user_role.title()
    
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Reactivated - Welcome Back!</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .success-box {{
                background: #f0f9f0;
                border: 1px solid #d4edda;
                color: #002B5B;
                padding: 25px;
                border-radius: 8px;
                margin: 25px 0;
                border-left: 4px solid #c92a2a;
            }}
            .details-box {{
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
            }}
            .button {{
                display: inline-block;
                background: #c92a2a;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 25px;
                margin: 15px 0;
                font-weight: bold;
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #b02525;
                transform: translateY(-2px);
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">✅ Account Reactivated!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Welcome Back to MyCareerCoach</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {user_name},</h2>
                
                <div class="success-box">
                    <h3 style="color: #002B5B; margin-top: 0;">🎉 Good News!</h3>
                    <p style="color: #002B5B; margin-bottom: 0;">Your {role_display} account has been successfully reactivated and is now fully accessible.</p>
                </div>
                
                <div class="details-box">
                    <h3 style="color: #002B5B; margin-top: 0;">📋 Account Status</h3>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>User:</strong> {user_name}
                    </div>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>Role:</strong> {role_display}
                    </div>
                    <div style="margin: 12px 0; color: #002B5B;">
                        <strong>Status:</strong> 
                        <span style="color: #c92a2a; font-weight: bold; background: #fff3f3; padding: 4px 12px; border-radius: 15px; margin-left: 10px;">
                            Active
                        </span>
                    </div>
                </div>
                
                <p style="color: #002B5B;">You can now access all platform features and resume your normal activities.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">Login to Your Account</a>
                </div>
                
                <h3 style="color: #002B5B;">What's Next:</h3>
                <ul style="color: #002B5B; padding-left: 20px;">
                    <li>Log in to your account using your credentials</li>
                    <li>Review any missed notifications or updates</li>
                    <li>Resume your activities on the platform</li>
                </ul>
                
                <p style="color: #002B5B;">If you experience any issues accessing your account or have any questions, please don't hesitate to contact our support team.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">MyCareerCoach Administration Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_student_booking_confirmation(student_name: str, counselor_name: str, appointment_date: str, 
                                           appointment_time: str, duration: int, appointment_type: str, 
                                           notes: str, appointment_id: str) -> str:
    """
    HTML email template for student booking confirmation - Updated with brand colors
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Booking Confirmation</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .appointment-details {{
                background: #f0f7ff;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #002B5B;
            }}
            .detail-item {{
                margin: 12px 0;
                display: flex;
                justify-content: space-between;
                color: #002B5B;
            }}
            .detail-label {{
                font-weight: bold;
                color: #002B5B;
            }}
            .status-pending {{
                background: #fff3e0;
                color: #e67700;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                display: inline-block;
            }}
            .next-steps {{
                background: #f0f7ff;
                border-left: 4px solid #002B5B;
                padding: 20px;
                margin: 25px 0;
                border-radius: 0 8px 8px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">📅 Appointment Booked!</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Your counseling session has been scheduled</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {student_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">Thank you for booking a counseling session. Your appointment has been scheduled and is awaiting confirmation from the counselor.</p>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">Appointment Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Counselor:</span>
                        <span>{counselor_name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date:</span>
                        <span>{appointment_date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span>{appointment_time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration:</span>
                        <span>{duration} minutes</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type:</span>
                        <span>{appointment_type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="status-pending">Pending Confirmation</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Appointment ID:</span>
                        <span>#{appointment_id}</span>
                    </div>
                </div>
                
                {f'<div class="detail-item"><span class="detail-label">Your Notes:</span><span style="color: #002B5B;">{notes}</span></div>' if notes else ''}
                
                <div class="next-steps">
                    <h4 style="color: #002B5B; margin-top: 0;">📋 What Happens Next?</h4>
                    <ol style="color: #002B5B; padding-left: 20px;">
                        <li>The counselor will review your appointment request</li>
                        <li>You'll receive a confirmation email once approved</li>
                        <li>Meeting details will be provided upon confirmation</li>
                        <li>You can cancel or reschedule up to 24 hours before the session</li>
                    </ol>
                </div>
                
                <p style="color: #002B5B;">You'll receive another email once the counselor confirms your appointment.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def html_content_counselor_booking_notification(counselor_name: str, student_name: str, student_email: str, 
                                              appointment_date: str, appointment_time: str, duration: int, 
                                              appointment_type: str, notes: str, appointment_id: str) -> str:
    """
    HTML email template for counselor booking notification - Updated with brand colors
    """
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Request</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #002B5B;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 43, 91, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #002B5B 0%, #c92a2a 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .appointment-details {{
                background: #f0f7ff;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #002B5B;
            }}
            .detail-item {{
                margin: 12px 0;
                display: flex;
                justify-content: space-between;
                color: #002B5B;
            }}
            .detail-label {{
                font-weight: bold;
                color: #002B5B;
            }}
            .student-info {{
                background: #f0f7ff;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #c92a2a;
            }}
            .action-required {{
                background: #fff3e0;
                border: 2px solid #ffc107;
                color: #002B5B;
                padding: 20px;
                border-radius: 8px;
                margin: 25px 0;
                text-align: center;
            }}
            .button {{
                display: inline-block;
                background: #c92a2a;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 25px;
                margin: 8px 5px;
                font-weight: bold;
                transition: all 0.3s ease;
            }}
            .button:hover {{
                background: #b02525;
                transform: translateY(-2px);
            }}
            .button-confirm {{
                background: #28a745;
            }}
            .button-confirm:hover {{
                background: #218838;
            }}
            .button-decline {{
                background: #dc3545;
            }}
            .button-decline:hover {{
                background: #c82333;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #e2e8f0;
                color: #666;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px; font-weight: bold;">📬 New Appointment Request</h1>
                <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Action Required - Please Review</p>
            </div>
            <div class="content">
                <h2 style="color: #002B5B; margin-bottom: 20px;">Hello {counselor_name},</h2>
                <p style="color: #002B5B; margin-bottom: 20px;">You have received a new appointment request from a student.</p>
                
                <div class="student-info">
                    <h3 style="color: #002B5B; margin-top: 0;">Student Information</h3>
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span>{student_name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span>{student_email}</span>
                    </div>
                </div>
                
                <div class="appointment-details">
                    <h3 style="color: #002B5B; margin-top: 0;">Appointment Details</h3>
                    <div class="detail-item">
                        <span class="detail-label">Date:</span>
                        <span>{appointment_date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span>{appointment_time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration:</span>
                        <span>{duration} minutes</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type:</span>
                        <span>{appointment_type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Appointment ID:</span>
                        <span>#{appointment_id}</span>
                    </div>
                </div>
                
                {f'<div class="detail-item"><span class="detail-label">Student Notes:</span><span style="color: #002B5B;">{notes}</span></div>' if notes else ''}
                
                <div class="action-required">
                    <h3 style="color: #002B5B; margin-top: 0;">⚠️ Action Required</h3>
                    <p style="color: #002B5B; margin-bottom: 0;">Please confirm or decline this appointment request within 24 hours.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" class="button">View in Dashboard</a>
                    <a href="#" class="button button-confirm">Confirm Appointment</a>
                    <a href="#" class="button button-decline">Decline Appointment</a>
                </div>
                
                <p style="color: #002B5B;"><strong>Note:</strong> The student will be notified once you take action on this request.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Best regards,<br><strong style="color: #002B5B;">The MyCareerCoach Team</strong></p>
                    <p style="margin: 10px 0 0;"><small>This is an automated message. Please do not reply to this email.</small></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """





