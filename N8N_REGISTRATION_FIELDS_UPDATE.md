# Update n8n for Institution / Academy & Academic Level

The website now sends these fields on every registration:

| Field | Example |
|-------|---------|
| `institution` | IIT Hyderabad |
| `institutionAcademy` | same as institution |
| `academicLevel` | B.Tech 2 (human-readable) |
| `grade` | btech-2 (raw value) |
| `location` | Hyderabad, India |
| `adminNotificationHtml` | Full Student Details HTML block |

If your n8n **Normalize Lead Data** code node only maps `name`, `email`, `phone`, `grade`, `board`, `city`, `country` — **`institution` is dropped**. Update both the Code node and the email template below.

---

## Step 1: Update Normalize Lead Data (Code node)

Replace your normalize script with:

```javascript
const d = $input.first().json;

const grade = d.grade || d.academicLevel || '';
const city = d.city || '';
const country = d.country || '';

return [{
  json: {
    timestamp: d.timestamp || new Date().toISOString(),
    name: d.name || d.fullName || '',
    email: d.email || d.emailAddress || '',
    phone: d.phone || d.phoneNumber || '',
    course: d.course || d.batch || d.board || d.courses || '',
    board: d.board || d.course || d.batch || '',
    grade,
    academicLevel: d.academicLevel || grade,
    institution: d.institution || d.institutionAcademy || d.academy || '',
    institutionAcademy: d.institutionAcademy || d.institution || d.academy || '',
    city,
    country,
    location: d.location || [city, country].filter(Boolean).join(', '),
    referrer: d.referrer || '',
    adminNotificationHtml: d.adminNotificationHtml || '',
    adminNotificationText: d.adminNotificationText || '',
    utm_source: d.utm?.source || d.utm_source || '',
    utm_medium: d.utm?.medium || d.utm_medium || '',
    utm_campaign: d.utm?.campaign || d.utm_campaign || '',
  },
}];
```

---

## Step 2: Update team notification email

**Option A (recommended)** — use the pre-built HTML from the website:

- **Email Type:** HTML
- **Message:** `{{ $json.adminNotificationHtml }}`

**Option B** — add these lines to your existing Student Details template:

```html
<p><strong>Academic Level:</strong> {{ $json.academicLevel || $json.grade || 'Not provided' }}</p>
<p><strong>Institution / Academy:</strong> {{ $json.institutionAcademy || $json.institution || 'Not provided' }}</p>
<p><strong>Location:</strong> {{ $json.location || 'Not provided' }}</p>
```

Place them after **Course/Batch** and before **Registered At**.

---

## Step 3: Google Sheet columns (optional)

Add a column **Institution / Academy** after Academic Level:

```
name | email | phone | course | academicLevel | institution | city | country | timestamp | referrer
```

Map in Google Sheets node:

```
institution → {{ $json.institutionAcademy }}
academicLevel → {{ $json.academicLevel }}
```

---

## Test

1. Save and activate the n8n workflow.
2. Submit a test registration with Institution / Academy filled in.
3. Confirm the notification email shows **Institution / Academy** and **Academic Level**.

Workflow URL: https://manasapadavala.app.n8n.cloud/workflow/Mbd8YfxUlm5NnRwV
