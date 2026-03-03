import os
import glob
from dotenv import load_dotenv
from pinecone import Pinecone
import google.generativeai as genai
import docx
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Import your existing database connection
from database.connection import SessionLocal, engine
from database.models import Base, Blog  

load_dotenv()


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

def read_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return "\n\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except: return None

def start_migration():
    print("🚀 Starting Fresh Migration...")
    
    
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    
    files = glob.glob("data/*.docx")
    print(f"📂 Found {len(files)} Word documents.")

    for file_path in files:
        try:
            print(f"Processing: {os.path.basename(file_path)}...")
            full_text = read_docx(file_path)
            
            if not full_text: 
                print("   ⚠️ Empty file, skipping.")
                continue

            title = os.path.basename(file_path)

            # Blog exists?
            existing = session.query(Blog).filter(Blog.title == title).first()
            if not existing:
                new_blog = Blog(title=title, content=full_text)
                session.add(new_blog)
                session.commit()
                session.refresh(new_blog)
                blog_id = new_blog.id
                print(f"   ✅ Saved to Database (ID: {blog_id})")
            else:
                blog_id = existing.id
                print(f"   ⚠️ Already in DB (ID: {blog_id})")

            
            chunks = text_splitter.split_text(full_text)
            vectors = []
            
            for i, chunk_text in enumerate(chunks):
               
                res = genai.embed_content(
                    model="models/gemini-embedding-001",
                    content=chunk_text,
                    task_type="retrieval_document"
                )
                
                vectors.append({
                    "id": f"{blog_id}_{i}",
                    "values": res['embedding'],
                    "metadata": {
                        "text": chunk_text,
                        "blog_id": str(blog_id),
                        "source": title
                    }
                })
            
            if vectors:
                index.upsert(vectors=vectors)
                print(f"   🧠 Uploaded {len(vectors)} chunks to Pinecone.")

        except Exception as e:
            print(f" Error: {e}")
            session.rollback()

    session.close()
    print("🎉 Migration Complete!")

if __name__ == "__main__":
    start_migration()