from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import os

def create_vector_database():
    print("Loading PDFs...")
    
    # Load all PDFs
    loader = DirectoryLoader(
        'knowledge-base/ncert',
        glob="**/*.pdf",
        loader_cls=PyPDFLoader,
        show_progress=True
    )
    documents = loader.load()
    print(f"Loaded {len(documents)} pages")
    
    # Split into chunks
    print("Splitting into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks")
    
    # Create embeddings
    print("Creating embeddings (this may take a few minutes)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )
    
    # Create vector database
    print("Creating ChromaDB...")
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory="./chromadb_data",
        collection_name="physics_ncert"
    )
    
    print(f"Vector database created with {vectordb._collection.count()} chunks")
    print("Setup complete!")
    
    # Test retrieval
    print("\nTesting retrieval...")
    test_query = "What is Newton's first law?"
    results = vectordb.similarity_search(test_query, k=3)
    print(f"\nQuery: {test_query}")
    print(f"Found {len(results)} relevant chunks")
    if results:
        # Handle Unicode encoding for Windows console
        try:
            top_result = results[0].page_content[:200].encode('utf-8', errors='ignore').decode('utf-8')
            print(f"Top result: {top_result}...")
        except:
            print(f"Top result: [Retrieved {len(results[0].page_content)} characters]")

if __name__ == "__main__":
    create_vector_database()
