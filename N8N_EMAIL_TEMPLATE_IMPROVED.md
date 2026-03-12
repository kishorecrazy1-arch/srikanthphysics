    47# 📧 Improved n8n Email Template

    ## Current Issue
    The email currently just shows "This email was sent automatically with n8n" with minimal formatting. We need a professional, well-formatted email with all lead details.

    ---

    ## ⚙️ Configuration Variables

    Before setting up the email templates, configure these variables in your n8n workflow (add a **Set** node before the Email nodes):

    ```javascript
    {
      "productName": "Your Product Name",           // e.g., "Srikanth's Academy"
      "productEmail": "your-email@example.com",     // Support email
      "productPhone": "+91 9492937716",             // Support phone
      "teamEmail": "team@example.com",              // Team notification email
      "productWebsite": "https://yourwebsite.com"   // Your website URL
    }
    ```

    **How to add variables in n8n:**
    1. Add a **Set** node after the Webhook node
    2. Add the above fields as key-value pairs
    3. These will be available as `{{ $json.productName }}`, `{{ $json.productEmail }}`, etc.

    ---

    ## ✅ Step 1: Update Email Template in n8n

    ### For Student Confirmation Email

    1. **Open your n8n workflow**
    2. **Find the Email node** that sends to the student
    3. **Update the email configuration:**

    **Subject:**
    ```
    🎓 Demo Booking Confirmed - {{ $json.productName || 'Our Product' }}
    ```

    **Email Type:** `HTML`

    **Message (HTML):**
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
        <h1>🎉 Demo Booking Confirmed!</h1>
        <p>Welcome to {{ $json.productName || 'Our Product' }}</p>
        </div>
        
        <div class="content">
        <p>Hi <strong>{{ $json.name }}</strong>,</p>
        
        <p>Thank you for booking your free demo session with {{ $json.productName || 'us' }}!</p>
        
        <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">📋 Your Details</h3>
            <p><strong>Name:</strong> {{ $json.name }}</p>
            <p><strong>Email:</strong> {{ $json.email }}</p>
            {{#if $json.phone}}
            <p><strong>Phone:</strong> {{ $json.phone }}</p>
            {{/if}}
            {{#if $json.grade}}
            <p><strong>Grade:</strong> {{ $json.grade }}</p>
            {{/if}}
            {{#if $json.board}}
            <p><strong>Board/Curriculum:</strong> {{ $json.board }}</p>
            {{/if}}
            {{#if $json.city}}
            <p><strong>City:</strong> {{ $json.city }}</p>
            {{/if}}
            {{#if $json.country}}
            <p><strong>Country:</strong> {{ $json.country }}</p>
            {{/if}}
        </div>
        
        <h3>⏰ What Happens Next?</h3>
        <ol>
            <li><strong>Confirmation:</strong> We've received your booking</li>
            <li><strong>Contact:</strong> Our team will reach out to you via WhatsApp/Email within 24 hours</li>
            <li><strong>Schedule:</strong> We'll schedule your free demo at a convenient time</li>
            <li><strong>Demo:</strong> During the demo, you'll see our platform and get personalized guidance</li>
        </ol>
        
        <p>If you have any questions, feel free to contact us:</p>
        <p>
            {{#if $json.productEmail}}
            📧 Email: <a href="mailto:{{ $json.productEmail }}">{{ $json.productEmail }}</a><br>
            {{/if}}
            {{#if $json.productPhone}}
            📱 Phone: {{ $json.productPhone }}
            {{/if}}
        </p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>{{ $json.productName || 'Our' }} Team</strong></p>
        </div>
        
        <div class="footer">
        <p>This email was sent automatically. Please do not reply directly to this email.</p>
        </div>
    </div>
    </body>
    </html>
    ```

    ---

    ### For Team Notification Email

    **To:** `{{ $json.teamEmail || 'your-team@example.com' }}`

    **Subject:**
    ```
    🎯 New Demo Lead: {{ $json.name }} - {{ $json.productName || 'Demo Booking' }}
    ```

    **Email Type:** `HTML`

    **Message (HTML):**
    ```html
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .lead-card { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .lead-item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .lead-item:last-child { border-bottom: none; }
        .lead-label { font-weight: bold; color: #667eea; display: inline-block; width: 150px; }
        .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
        <h1>🎯 New Demo Lead Received</h1>
        <p>Action Required: Contact within 24 hours</p>
        </div>
        
        <div class="content">
        <div class="lead-card">
            <h2 style="margin-top: 0; color: #667eea;">📋 Lead Information</h2>
            
            <div class="lead-item">
            <span class="lead-label">Name:</span>
            <strong>{{ $json.name }}</strong>
            </div>
            
            <div class="lead-item">
            <span class="lead-label">Email:</span>
            <a href="mailto:{{ $json.email }}">{{ $json.email }}</a>
            </div>
            
            {{#if $json.phone}}
            <div class="lead-item">
            <span class="lead-label">Phone:</span>
            <a href="tel:{{ $json.phone }}">{{ $json.phone }}</a>
            </div>
            {{/if}}
            
            {{#if $json.grade}}
            <div class="lead-item">
            <span class="lead-label">Grade:</span>
            {{ $json.grade }}
            </div>
            {{/if}}
            
            {{#if $json.board}}
            <div class="lead-item">
            <span class="lead-label">Board:</span>
            {{ $json.board }}
            </div>
            {{/if}}
            
            {{#if $json.city}}
            <div class="lead-item">
            <span class="lead-label">City:</span>
            {{ $json.city }}
            </div>
            {{/if}}
            
            {{#if $json.country}}
            <div class="lead-item">
            <span class="lead-label">Country:</span>
            {{ $json.country }}
            </div>
            {{/if}}
            
            <div class="lead-item">
            <span class="lead-label">Source:</span>
            {{ $json.source || 'demo-booking' }}
            </div>
            
            <div class="lead-item">
            <span class="lead-label">Submitted:</span>
            {{ $json.timestamp }}
            </div>
            
            {{#if $json.utm}}
            <div class="lead-item">
            <span class="lead-label">UTM Source:</span>
            {{ $json.utm.source || 'N/A' }}
            </div>
            {{/if}}
            
            {{#if $json.referrer}}
            <div class="lead-item">
            <span class="lead-label">Referrer:</span>
            <a href="{{ $json.referrer }}" target="_blank">{{ $json.referrer }}</a>
            </div>
            {{/if}}
        </div>
        
        <div class="urgent">
            <h3 style="margin-top: 0;">⚠️ Action Required</h3>
            <p><strong>Next Steps:</strong></p>
            <ol>
            <li>Contact {{ $json.name }} via WhatsApp/Email within 24 hours</li>
            <li>Schedule free demo at a convenient time</li>
            <li>Follow up with personalized guidance</li>
            </ol>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-radius: 8px;">
            <h3 style="margin-top: 0;">📞 Quick Actions</h3>
            {{#if $json.phone}}
            <p>
            <a href="https://wa.me/{{ replace $json.phone '+' '' }}" style="display: inline-block; padding: 10px 20px; background: #25D366; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                📱 WhatsApp
            </a>
            <a href="tel:{{ $json.phone }}" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                📞 Call
            </a>
            </p>
            {{/if}}
            <p>
            <a href="mailto:{{ $json.email }}" style="display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                ✉️ Send Email
            </a>
            </p>
        </div>
        </div>
        
        <div class="footer">
        <p>This notification was sent automatically from your demo booking system.</p>
        </div>
    </div>
    </body>
    </html>
    ```

    ---

    ## ✅ Step 2: Update n8n Workflow

    1. **Open your n8n workflow**
    2. **Find the Email node** (or add if missing)
    3. **Paste the HTML template above**
    4. **Save and activate the workflow**

    ---

    ## 🧪 Step 3: Test the Email

    1. Submit a test demo form
    2. Check both email inboxes:
    - Student confirmation email (should be nicely formatted)
    - Team notification email (should have all lead details)

    ---

    ## 📝 Notes

    - Replace `{{ $json.field }}` with actual n8n expression syntax if needed
    - Adjust colors/styling to match your brand
    - Add your logo if desired
    - Test on mobile devices to ensure responsive design

    ---

    ## ✅ Result

    After updating, emails will:
    - ✅ Look professional and branded
    - ✅ Show all lead details clearly formatted
    - ✅ Include next steps for the student
    - ✅ Include action items for your team
    - ✅ Have quick action buttons (WhatsApp, Call, Email)
