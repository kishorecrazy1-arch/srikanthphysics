from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_classic.chains.retrieval_qa.base import RetrievalQA
from langchain_core.prompts import PromptTemplate
from typing import Optional, List
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from parent directory (project root)
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)
# Also try loading from current directory as fallback
load_dotenv()

app = FastAPI(title="Srikanth Academy RAG API")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load embeddings and vector database
print("Loading RAG system...")
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'}
)

vectordb = Chroma(
    persist_directory="./chromadb_data",
    embedding_function=embeddings,
    collection_name="physics_ncert"
)

# Initialize LLM (supports both OpenAI and Claude)
def get_llm(provider: str = "anthropic"):
    if provider == "anthropic":
        api_key = os.getenv('VITE_ANTHROPIC_API_KEY') or os.getenv('ANTHROPIC_API_KEY')
        return ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0.3,
            anthropic_api_key=api_key
        )
    else:  # openai
        api_key = os.getenv('VITE_OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY')
        return ChatOpenAI(
            model="gpt-4o",
            temperature=0.3,
            openai_api_key=api_key
        )

# Prompt template
PHYSICS_TUTOR_PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are an expert Physics tutor for Srikanth Academy, specializing in AP Physics and NCERT curriculum.

Use the following NCERT content to answer the student's question:

CONTEXT FROM NCERT:
{context}

STUDENT'S QUESTION:
{question}

INSTRUCTIONS:
1. Provide a clear, step-by-step explanation
2. Use the NCERT content as your primary reference
3. Include relevant formulas and principles
4. Cite which NCERT class/chapter the information comes from
5. Add 2-3 practice problems related to the concept
6. If the question is outside the provided context, clearly state that

ANSWER:"""
)

# Request/Response models
class QuestionRequest(BaseModel):
    question: str
    llm_provider: Optional[str] = "anthropic"  # or "openai"
    num_sources: Optional[int] = 5

class AnswerResponse(BaseModel):
    answer: str
    sources: List[dict]
    total_chunks_searched: int

class GeneratePracticeRequest(BaseModel):
    topic: str
    difficulty: str  # "easy", "medium", "hard"
    num_problems: int = 5
    llm_provider: Optional[str] = "anthropic"

# Endpoints
@app.get("/")
async def root():
    return {
        "service": "Srikanth Academy RAG API",
        "status": "running",
        "total_chunks": vectordb._collection.count(),
        "endpoints": {
            "POST /ask": "Ask physics questions",
            "POST /generate-practice": "Generate practice problems",
            "GET /stats": "Get database statistics",
            "POST /add-content": "Add custom content to knowledge base"
        }
    }

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest):
    """
    Main RAG endpoint - Ask physics questions
    """
    try:
        # Get LLM
        llm = get_llm(request.llm_provider)
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectordb.as_retriever(
                search_kwargs={"k": request.num_sources}
            ),
            return_source_documents=True,
            chain_type_kwargs={"prompt": PHYSICS_TUTOR_PROMPT}
        )
        
        # Get answer
        result = qa_chain.invoke({qa_chain.input_key: request.question})
        
        # Format sources - RetrievalQA may or may not include source_documents
        sources = []
        if 'source_documents' in result:
            for doc in result['source_documents']:
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata,
                    "page": doc.metadata.get('page', 'N/A'),
                    "source": doc.metadata.get('source', 'NCERT')
                })
        else:
            # If not included, retrieve separately
            retriever = vectordb.as_retriever(search_kwargs={"k": request.num_sources})
            docs = retriever.get_relevant_documents(request.question)
            for doc in docs:
                sources.append({
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata,
                    "page": doc.metadata.get('page', 'N/A'),
                    "source": doc.metadata.get('source', 'NCERT')
                })
        
        return AnswerResponse(
            answer=result[qa_chain.output_key],
            sources=sources,
            total_chunks_searched=vectordb._collection.count()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-practice")
async def generate_practice_problems(request: GeneratePracticeRequest):
    """
    Generate practice problems on a specific topic
    """
    try:
        # Retrieve relevant content
        docs = vectordb.similarity_search(request.topic, k=3)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Get LLM
        llm = get_llm(request.llm_provider)
        
        # Generate problems
        prompt = f"""Based on this NCERT Physics content:

{context}

Generate {request.num_problems} {request.difficulty}-level practice problems on the topic: {request.topic}

For each problem:
1. State the problem clearly
2. Provide difficulty rating
3. Include complete step-by-step solution
4. Mention key concepts used

Format as JSON array with: question, difficulty, solution, concepts"""
        
        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        response_content = response.content if hasattr(response, 'content') else str(response)
        
        return {
            "topic": request.topic,
            "difficulty": request.difficulty,
            "problems": response_content,
            "sources_used": len(docs)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get database statistics"""
    return {
        "total_chunks": vectordb._collection.count(),
        "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
        "vector_db": "ChromaDB",
        "knowledge_base": "NCERT Physics (Classes 11-12)"
    }

@app.post("/add-content")
async def add_custom_content(content: str, metadata: dict):
    """
    Add custom content to knowledge base (for Srikanth's own notes)
    """
    try:
        from langchain_core.documents import Document
        
        # Create document
        doc = Document(page_content=content, metadata=metadata)
        
        # Add to vector DB
        vectordb.add_documents([doc])
        
        return {
            "status": "success",
            "message": "Content added to knowledge base",
            "new_total": vectordb._collection.count()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    print("Starting Srikanth Academy RAG API...")
    print("Vector DB loaded with", vectordb._collection.count(), "chunks")
    uvicorn.run(app, host="0.0.0.0", port=port)
