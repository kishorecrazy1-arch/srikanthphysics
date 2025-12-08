# Production Mode Setup - Quick Checklist

## ✅ Steps to Enable Production Mode

### 1. Verify API Keys in .env
Your `.env` file` should have REAL keys (not placeholders):
```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx  (NOT "your-openai-api-key-here")
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx  (NOT "your-anthropic-api-key-here")
```

### 2. Restart Dev Server (IMPORTANT!)
Environment variables are loaded when the server starts. You MUST restart:

1. **Stop current server**: Press `Ctrl+C` in terminal
2. **Start again**: `npm run dev`
3. **Wait for**: "VITE v5.x.x ready"

### 3. Disable Test Mode
If test mode is active:
- Go to login page
- Click "Disable" in green banner
- OR run in browser console:
  ```javascript
  localStorage.removeItem('testMode');
  location.reload();
  ```

### 4. Verify Production Mode
Open browser console (F12) and look for:
- ✅ "✅ OpenAI API key detected - Using AI generation (Production Mode)"
- ✅ "🚀 Generating questions with AI (Production Mode)..."
- ❌ Should NOT see: "Using sample questions"

### 5. Generate Questions
1. Go to Daily Practice tab
2. Click "Get 10 Questions"
3. Check console - should show:
   - "Generating questions with AI (Production Mode)..."
   - "✅ AI-generated questions received: 10"

## 🔍 How to Know You're in Production Mode

### Console Messages:
✅ **Production Mode:**
```
✅ OpenAI API key detected - Using AI generation (Production Mode)
🚀 Generating questions with AI (Production Mode)...
✅ AI-generated questions received: 10
```

❌ **Test Mode (Sample Questions):**
```
⚠️ OpenAI API key not configured. Using sample questions.
Generating sample questions...
```

### Question Quality:
- **Production**: Unique, detailed, physics-accurate questions
- **Test**: Generic sample questions with placeholder text

## 🚨 Common Issues

### Issue: Still seeing sample questions
**Solution:**
1. Verify `.env` has real keys (not placeholders)
2. **Restart dev server** (must restart after .env changes)
3. Clear browser cache
4. Check console for API key detection message

### Issue: API key not detected
**Solution:**
- Check `.env` file is in project root (same folder as `package.json`)
- Key format: `VITE_OPENAI_API_KEY=sk-proj-...` (must start with `VITE_`)
- Restart dev server after changing `.env`

### Issue: Test mode still active
**Solution:**
```javascript
// Run in browser console
localStorage.removeItem('testMode');
location.reload();
```

---

**After restarting the server, you'll be in PRODUCTION MODE!** 🚀











