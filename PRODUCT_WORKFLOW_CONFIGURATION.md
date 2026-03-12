# 🔄 Product-Agnostic Workflow Configuration Guide

## Overview

Your "Book Your Demo" workflow has been updated to be **product-agnostic**, meaning you can easily configure it for any product or service without changing code.

---

## ✅ What Changed

### 1. **Code Updates**
- `demoService.ts` now uses `VITE_PRODUCT_SOURCE` environment variable
- Defaults to `"demo-booking"` if not configured
- Can be overridden per submission via function parameter

### 2. **Email Templates**
- All product-specific text now uses variables
- Product name, email, phone are configurable
- Templates work for any product/service

### 3. **Documentation**
- Updated to reflect product-agnostic approach
- Added configuration instructions

---

## 🚀 How to Configure for Your Product

### Step 1: Set Environment Variable

Add to your `.env` file:

```env
# Product identifier (used in webhook payload)
VITE_PRODUCT_SOURCE=your-product-name

# n8n Webhook URL
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/demo-booking
```

### Step 2: Configure n8n Workflow Variables

In your n8n workflow, add a **Set** node after the Webhook node with these values:

```javascript
{
  "productName": "Your Product Name",
  "productEmail": "support@yourproduct.com",
  "productPhone": "+1-555-0100",
  "teamEmail": "team@yourproduct.com",
  "productWebsite": "https://yourproduct.com"
}
```

### Step 3: Update Email Templates

The email templates in `N8N_EMAIL_TEMPLATE_IMPROVED.md` now automatically use these variables:
- `{{ $json.productName }}` - Your product name
- `{{ $json.productEmail }}` - Support email
- `{{ $json.productPhone }}` - Support phone
- `{{ $json.teamEmail }}` - Team notification email

---

## 📋 Example Configurations

### Example 1: AP Physics Course
```env
VITE_PRODUCT_SOURCE=ap-physics-demo
```

n8n Set node:
```javascript
{
  "productName": "Srikanth's Academy",
  "productEmail": "srikanthsacademyforphysics@gmail.com",
  "productPhone": "+91 9492937716",
  "teamEmail": "srikanthsacademyforphysics@gmail.com"
}
```

### Example 2: Generic SaaS Product
```env
VITE_PRODUCT_SOURCE=saas-demo
```

n8n Set node:
```javascript
{
  "productName": "My SaaS Platform",
  "productEmail": "support@mysaas.com",
  "productPhone": "+1-555-0100",
  "teamEmail": "sales@mysaas.com"
}
```

### Example 3: E-commerce Platform
```env
VITE_PRODUCT_SOURCE=ecommerce-demo
```

n8n Set node:
```javascript
{
  "productName": "My E-commerce Store",
  "productEmail": "hello@mystore.com",
  "productPhone": "+1-555-0200",
  "teamEmail": "leads@mystore.com"
}
```

---

## 🔄 Switching Between Products

### Option 1: Environment Variable (Recommended)
Change `VITE_PRODUCT_SOURCE` in `.env` and restart your dev server.

### Option 2: Multiple Workflows
Create separate n8n workflows for each product:
- `/webhook/demo-booking-product1`
- `/webhook/demo-booking-product2`
- `/webhook/demo-booking-product3`

Each workflow can have different product variables.

### Option 3: Dynamic Product Selection
Pass product source when calling `submitDemoLead()`:

```typescript
await submitDemoLead(formData, utm, 'custom-product-name');
```

---

## 📝 Workflow Structure

Your n8n workflow should have this structure:

```
1. Webhook Node
   ↓
2. Set Node (Product Variables)
   ↓
3. Email Node (Student Confirmation)
   ↓
4. Email Node (Team Notification)
   ↓
5. Google Sheets (Save Lead)
```

---

## ✅ Testing

1. **Set your product variables** in `.env` and n8n
2. **Submit a test form** from your demo page
3. **Check emails** - should show your product name
4. **Verify webhook payload** - `source` field should match `VITE_PRODUCT_SOURCE`

---

## 🆘 Troubleshooting

### Product name not showing in emails
- Check that Set node is placed **before** Email nodes
- Verify variable names match exactly: `productName`, `productEmail`, etc.
- Check n8n execution logs to see if variables are set

### Wrong source in webhook payload
- Verify `VITE_PRODUCT_SOURCE` is set in `.env`
- Restart dev server after changing `.env`
- Check browser console for the actual payload being sent

### Variables not available in templates
- Ensure Set node is connected **between** Webhook and Email nodes
- Check that variable names use camelCase (e.g., `productName` not `product_name`)

---

## 📚 Related Files

- `src/services/demoService.ts` - Main service file
- `N8N_EMAIL_TEMPLATE_IMPROVED.md` - Email templates
- `DEMO_FUNNEL_SETUP.md` - Complete setup guide
- `N8N_WORKFLOW_SETUP_GUIDE.md` - n8n workflow setup

---

## ✅ Ready to Use!

Your workflow is now product-agnostic and ready to be configured for any product or service. Just update the environment variables and n8n configuration, and you're good to go! 🎉
