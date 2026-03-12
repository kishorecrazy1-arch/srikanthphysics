# 🎯 Free Demo Funnel Setup Guide

## Overview

This guide explains how to set up the Free Demo funnel that collects leads and sends them to n8n → Google Sheets.

---

## ✅ What's Been Created

### Pages
- **`/demo`** - Lead capture form
- **`/demo/success`** - Success confirmation page

### Components
- **`DemoForm`** - Form with validation (Zod)
- **`CalendlyEmbed`** - Optional Calendly integration

### Services & Utils
- **`demoService.ts`** - Sends data to n8n webhook
- **`utm.ts`** - UTM parameter tracking (URL + Cookie)
- **`demoSchemas.ts`** - Zod validation schemas

### Updated Pages
- **`CourseDetails.tsx`** - Added "Start Free Demo" CTA button

---

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# n8n Webhook URL (Required)
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/demo-booking

# Product Source Identifier (Optional - defaults to 'demo-booking')
# Use this to identify which product/service the demo is for
VITE_PRODUCT_SOURCE=your-product-name

# Calendly Integration (Optional)
VITE_CALENDLY_URL=https://calendly.com/your-username/demo-session

# Google reCAPTCHA (Optional - for future use)
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

---

## 📋 Form Fields

### Required Fields
- **Name** - Full name (min 2 chars)
- **Email** - Valid email address
- **Agree to Contact** - Checkbox (required)

### Optional Fields
- **Phone** - Phone number
- **Grade** - 10th, 11th, 12th, Other
- **Board** - CBSE, ICSE, AP, IB, IGCSE, Other
- **City** - City name
- **Country** - Country name

---

## 📤 Data Payload Sent to n8n

```json
{
  "source": "your-product-name",
  "timestamp": "2024-12-07T12:00:00.000Z",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "grade": "11",
  "board": "CBSE",
  "city": "Mumbai",
  "country": "India",
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "your-product-2024"
  },
  "referrer": "https://google.com"
}
```

**Note:** The `source` field will use `VITE_PRODUCT_SOURCE` from your `.env` file, or default to `"demo-booking"` if not set.

---

## 🔗 Routes

- **`/demo`** - Demo form page (public)
- **`/demo/success`** - Success page (public, redirects if no session data)

---

## 🎨 Features

### ✅ Implemented
- Form validation with Zod
- UTM parameter tracking (URL + Cookie storage)
- Referrer tracking
- Error handling and user feedback
- Loading states
- Responsive design
- Optional Calendly integration
- Success page with next steps

### 🔄 UTM Tracking
- Captures UTM params from URL query string
- Stores in cookie for 30 days
- Includes in payload sent to n8n
- Falls back to cookie if URL params not present

---

## 🧪 Testing

### Test the Form
1. Go to `/course/ap-physics`
2. Click "Start Free Demo"
3. Fill out the form
4. Submit
5. Should redirect to `/demo/success`

### Test UTM Tracking
1. Visit: `/demo?utm_source=google&utm_medium=cpc&utm_campaign=test`
2. Fill and submit form
3. Check n8n webhook receives UTM params

### Test Error Handling
1. Submit form without required fields
2. Should show validation errors
3. Try with invalid email
4. Should show email validation error

---

## 📊 n8n Workflow Setup

### Step 1: Create Webhook Node
1. Add **Webhook** node
2. Set method to **POST**
3. Set path to: `demo-booking` (or your custom path)
4. Enable **Respond** with 200 JSON: `{ "received": true }`

### Step 1.5: Configure Product Variables (Optional)
Add a **Set** node after the Webhook to configure product-specific information:
- `productName`: Your product/service name
- `productEmail`: Support email address
- `productPhone`: Support phone number
- `teamEmail`: Email for team notifications
- `productWebsite`: Your website URL

These variables will be used in email templates.

### Step 2: Normalize Data (Optional)
Add **Function** node to normalize:
```javascript
const d = items[0].json;
return [{
  json: {
    timestamp: d.timestamp || new Date().toISOString(),
    name: d.name || '',
    email: d.email || '',
    phone: d.phone || '',
    grade: d.grade || '',
    board: d.board || '',
    city: d.city || '',
    country: d.country || '',
    utm_source: d.utm?.source || '',
    utm_medium: d.utm?.medium || '',
    utm_campaign: d.utm?.campaign || ''
  }
}];
```

### Step 3: Google Sheets Append
1. Add **Google Sheets** node
2. Select **Append Row** operation
3. Configure:
   - Spreadsheet: `Srikanth_Academy_Leads`
   - Sheet: `AP_Physics_Demo`
   - Columns: `timestamp, name, email, phone, grade, board, city, country, utm_source, utm_medium, utm_campaign`

### Step 4: Optional Notifications
- Add **Gmail** node to send confirmation email
- Add **Telegram/Slack** node to notify team

---

## 🚀 Deployment Checklist

- [ ] Add `VITE_N8N_WEBHOOK_URL` to `.env`
- [ ] Add `VITE_CALENDLY_URL` (if using Calendly)
- [ ] Test form submission
- [ ] Verify n8n webhook receives data
- [ ] Check Google Sheets updates correctly
- [ ] Test UTM tracking
- [ ] Test error handling
- [ ] Verify success page redirects work

---

## 📝 Next Steps

1. **Set up n8n workflow** (see n8n Workflow Setup above)
2. **Create Google Sheet** with columns matching the payload
3. **Test end-to-end** flow
4. **Add actual PDF link** for syllabus download
5. **Add actual video link** for success video
6. **Configure Calendly** (if using)

---

## 🆘 Troubleshooting

### Form doesn't submit
- Check `VITE_N8N_WEBHOOK_URL` is set in `.env`
- Check browser console for errors
- Verify n8n webhook is accessible

### UTM params not captured
- Check URL has `?utm_source=...` format
- Check browser console for UTM logging
- Verify cookie is being set (check DevTools → Application → Cookies)

### Success page redirects immediately
- Check `sessionStorage` has `demoLead` data
- Verify form submission succeeded before redirect

---

## 📚 Files Created

```
src/
  components/
    DemoForm.tsx          # Main form component
    CalendlyEmbed.tsx     # Calendly integration
  pages/
    Demo.tsx              # Demo form page
    DemoSuccess.tsx       # Success page
  services/
    demoService.ts        # n8n webhook service
  lib/
    demoSchemas.ts        # Zod validation schemas
  utils/
    utm.ts                # UTM tracking utilities
```

---

## ✅ Ready to Use!

The demo funnel is now integrated into your app. Users can:
1. Click "Start Free Demo" on course pages
2. Fill out the form
3. Get redirected to success page
4. Data automatically sent to n8n → Google Sheets

