# 🔗 Webhook URL Quick Reference

## Current Workflow

**Workflow:** https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo

---

## How to Get Your Webhook URL

1. **Open the workflow** (link above)
2. **Click on the Webhook node** (first node)
3. **Copy the Production URL** shown in node settings
4. **Use that URL** in your `.env` and Vercel

---

## Common Formats

Your webhook URL will be one of these formats:

```
https://manasapadavala.app.n8n.cloud/webhook/demo-booking
```

OR

```
https://manasapadavala.app.n8n.cloud/webhook/XmafvLhS28STAmPo/demo-booking
```

**Note:** The exact path depends on what you configured in the Webhook node.

---

## Where to Update

### 1. Local Development (`.env` file)
```env
VITE_N8N_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/[your-path]
```

### 2. Vercel (Production)
- Go to: Vercel Dashboard → Settings → Environment Variables
- Update: `VITE_N8N_WEBHOOK_URL`
- Value: Your webhook URL from n8n
- Redeploy after updating

---

## Quick Test

Test your webhook URL with curl:

```bash
curl -X POST https://manasapadavala.app.n8n.cloud/webhook/[your-path] \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

If successful, you'll see an execution in your n8n workflow!

---

## Need Help?

See `UPDATE_WEBHOOK_URL.md` for detailed step-by-step instructions.
