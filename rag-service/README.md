# Srikanth Academy RAG Service

RAG (Retrieval-Augmented Generation) service for physics tutoring using NCERT content.

## Setup

1. **Activate virtual environment:**
   ```bash
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   # or
   venv\Scripts\activate  # Windows CMD
   ```

2. **Set environment variables:**
   Create a `.env` file in the `rag-service` directory with:
   ```env
   OPENAI_API_KEY=your_key_here  # Optional, for OpenAI
   ANTHROPIC_API_KEY=your_key_here  # Optional, for Claude
   ```
   Or it will use `VITE_OPENAI_API_KEY` and `VITE_ANTHROPIC_API_KEY` from the parent `.env` file.

## Usage

### 1. Download NCERT PDFs
```bash
python scripts/download_ncert.py
```

### 2. Create Vector Database
```bash
python scripts/create_vectordb.py
```

### 3. Start the RAG API Server
```bash
python api/rag_service.py
```

The API will start on `http://localhost:8000`

## API Endpoints

### `GET /`
Get service status and available endpoints

### `POST /ask`
Ask physics questions with RAG

**Request:**
```json
{
  "question": "What is Newton's first law?",
  "llm_provider": "anthropic",  // or "openai"
  "num_sources": 5
}
```

**Response:**
```json
{
  "answer": "...",
  "sources": [...],
  "total_chunks_searched": 230
}
```

### `POST /generate-practice`
Generate practice problems

### `GET /stats`
Get database statistics

### `POST /add-content`
Add custom content to knowledge base

## Testing

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)
