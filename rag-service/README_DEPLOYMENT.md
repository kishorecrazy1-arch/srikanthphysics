# Railway Deployment Guide

## Prerequisites

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

## Deployment Steps

### 1. Navigate to RAG Service Directory
```bash
cd rag-service
```

### 2. Initialize Railway Project
```bash
railway init
```
This will:
- Create a new Railway project (or link to existing)
- Add a `railway.toml` configuration file

### 3. Add Environment Variables

In the Railway dashboard (https://railway.app) or via CLI:

```bash
railway variables set ANTHROPIC_API_KEY=your_anthropic_key_here
railway variables set OPENAI_API_KEY=your_openai_key_here
```

Or add them in the Railway web dashboard:
- Go to your project → Variables
- Add:
  - `ANTHROPIC_API_KEY`
  - `OPENAI_API_KEY`

### 4. Deploy

**Option A: Deploy from local directory**
```bash
railway up
```

**Option B: Deploy from GitHub (Recommended for CI/CD)**
- Connect your GitHub repository
- Railway will auto-deploy on push to main branch

### 5. Get Your Deployment URL

After deployment, Railway will provide a URL like:
```
https://your-project-name.up.railway.app
```

Update your React app's `.env` file:
```env
VITE_RAG_API_URL=https://your-project-name.up.railway.app
```

## Important Notes

1. **Port Configuration**: Railway provides a `PORT` environment variable. The service should use this:
   ```python
   port = int(os.getenv('PORT', 8000))
   uvicorn.run(app, host="0.0.0.0", port=port)
   ```

2. **Vector Database**: The ChromaDB data needs to be persisted. Options:
   - Use Railway volumes for persistent storage
   - Or use a cloud vector database (Pinecone, Weaviate, etc.)
   - Or rebuild the vector DB on each deployment

3. **Build Requirements**: Railway will auto-detect Python and install dependencies from `requirements.txt`

4. **Health Check**: The `/` endpoint serves as the health check path

## Troubleshooting

- Check logs: `railway logs`
- View deployment status in Railway dashboard
- Ensure all environment variables are set correctly
- Verify the service starts correctly: Check startup logs for "Starting Srikanth Academy RAG API..."
