# 🆓 Free API Setup Guide for AI Physics Tutor

The RAG service now supports **FREE APIs**! No credit card required.

## ✅ Free API Options

### 1. **Groq API** (Recommended - Fastest & Free)
- **Speed**: Very fast responses
- **Free Tier**: Generous limits
- **Model**: Llama 3.1 70B (high quality)
- **Setup**: 2 minutes

### 2. **Google Gemini API** (Free Tier Available)
- **Speed**: Fast
- **Free Tier**: Good limits
- **Model**: Gemini 1.5 Flash
- **Setup**: 3 minutes

---

## 🚀 Quick Setup

### Option 1: Groq API (Recommended)

1. **Get Free API Key:**
   - Go to: https://console.groq.com/
   - Sign up (free, no credit card)
   - Navigate to "API Keys"
   - Click "Create API Key"
   - Copy your API key

2. **Add to `.env` file:**
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   # or
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   cd rag-service
   pip install langchain-groq
   ```

### Option 2: Google Gemini API

1. **Get Free API Key:**
   - Go to: https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy your API key

2. **Add to `.env` file:**
   ```env
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   # or
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   cd rag-service
   pip install langchain-google-genai
   ```

---

## 📋 Complete Setup Steps

### Step 1: Install Python Packages

```bash
cd rag-service
pip install -r requirements.txt
```

This will install:
- `langchain-groq` (for Groq API)
- `langchain-google-genai` (for Gemini API)

### Step 2: Add API Keys to `.env`

Add at least one free API key to your `.env` file in the project root:

```env
# Free APIs (Choose at least one)
VITE_GROQ_API_KEY=gsk_your_groq_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Paid APIs (Optional - only if you want premium models)
VITE_ANTHROPIC_API_KEY=sk-ant-your_key_here
VITE_OPENAI_API_KEY=sk-proj-your_key_here
```

### Step 3: Restart RAG Service

```bash
cd rag-service
python api/rag_service.py
```

The service will automatically:
1. Try Groq first (free)
2. Fallback to Gemini (free)
3. Fallback to Anthropic (paid) if available
4. Fallback to OpenAI (paid) if available

---

## 🎯 How It Works

The system uses **automatic fallback**:

1. **First Priority**: Groq (FREE) - Fastest
2. **Second Priority**: Gemini (FREE) - Good quality
3. **Third Priority**: Anthropic (PAID) - Premium quality
4. **Last Resort**: OpenAI (PAID) - Premium quality

If you only set up free APIs, it will use those exclusively!

---

## 🔍 Testing

After setup, test the AI Physics Tutor:

1. Go to: `http://localhost:5175`
2. Scroll to "AI Physics Tutor" section
3. Ask: "What is Newton's First Law?"
4. It should work with your free API! 🎉

---

## 💡 Tips

- **Groq** is recommended for speed (responses in < 1 second)
- **Gemini** is good for quality and reliability
- You can use both - the system will try Groq first, then Gemini
- No credit card needed for free APIs!

---

## 🆘 Troubleshooting

**Error: "No LLM provider available"**
- Make sure at least one API key is set in `.env`
- Restart the RAG service after adding keys
- Check that packages are installed: `pip list | grep langchain-groq`

**Error: "API key invalid"**
- Verify your API key is correct
- For Groq: Make sure it starts with `gsk_`
- For Gemini: Make sure it's from https://aistudio.google.com/

**Still seeing paid API errors?**
- The system will automatically use free APIs if configured
- Check browser console for which API is being used
- Free APIs are tried first!

---

## 📚 Resources

- **Groq Console**: https://console.groq.com/
- **Google AI Studio**: https://aistudio.google.com/
- **Groq Documentation**: https://groq.com/docs
- **Gemini Documentation**: https://ai.google.dev/docs

---

**You're all set! Enjoy your FREE AI Physics Tutor! 🎓✨**
