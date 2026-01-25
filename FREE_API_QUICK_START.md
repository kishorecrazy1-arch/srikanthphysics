# 🆓 Quick Start: Free API for AI Physics Tutor

## ✅ What's Been Updated

Your AI Physics Tutor now supports **FREE APIs**! No credit card needed.

## 🚀 Get Started in 2 Minutes

### Step 1: Get a Free API Key

**Option A: Groq (Recommended - Fastest)**
1. Visit: https://console.groq.com/
2. Sign up (free, no credit card)
3. Go to "API Keys" → "Create API Key"
4. Copy your key (starts with `gsk_`)

**Option B: Google Gemini (Alternative)**
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy your key

### Step 2: Add to `.env` File

Add this line to your `.env` file (in project root):

```env
# Free API (Choose one or both)
VITE_GROQ_API_KEY=gsk_your_key_here
VITE_GOOGLE_API_KEY=your_gemini_key_here
```

### Step 3: Restart RAG Service

```bash
# Stop current RAG service (Ctrl+C)
# Then restart:
cd rag-service
python api/rag_service.py
```

## 🎯 How It Works

The system automatically:
1. **Tries Groq first** (FREE - fastest)
2. **Falls back to Gemini** (FREE - reliable)
3. **Falls back to Anthropic** (if you have paid API)
4. **Falls back to OpenAI** (if you have paid API)

**If you only add free APIs, it will use those exclusively!**

## ✨ Benefits

- ✅ **100% Free** - No credit card required
- ✅ **Fast Responses** - Groq is very fast
- ✅ **Automatic Fallback** - Always works
- ✅ **No Setup Complexity** - Just add API key

## 📝 Example `.env` Entry

```env
# Free APIs (Add at least one)
VITE_GROQ_API_KEY=gsk_1234567890abcdef...

# Optional: Paid APIs (only if you want premium models)
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_OPENAI_API_KEY=sk-proj-...
```

## 🧪 Test It

1. Restart your RAG service
2. Go to: http://localhost:5175
3. Scroll to "AI Physics Tutor"
4. Ask: "What is Newton's First Law?"
5. It should work! 🎉

## 📚 Full Documentation

See `FREE_API_SETUP.md` for detailed instructions.

---

**That's it! Your AI Physics Tutor is now FREE! 🎓✨**
