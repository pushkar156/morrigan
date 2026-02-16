import os
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv
import time
import re  # Import regex for advanced cleaning

load_dotenv()

# --- 1. KEY ROTATION MANAGER (4 Keys) ---
class KeyManager:
    def __init__(self, prefix):
        self.keys = []
        self.index = 0
        # Automatically find keys GEMINI_API_KEY_1 to _4
        for i in range(1, 5): 
            key = os.getenv(f"{prefix}_{i}")
            if key: self.keys.append(key)
        
        # Fallback to single key if numbered ones aren't found
        if not self.keys:
            single_key = os.getenv(prefix)
            if single_key: self.keys.append(single_key)
            
        if not self.keys:
            print("⚠️ WARNING: No Gemini API keys found in .env!")
    
    def get_key(self):
        return self.keys[self.index]

    def rotate(self):
        self.index = (self.index + 1) % len(self.keys)
        print(f"🔄 Rate Limit Hit! Rotating to Key #{self.index + 1}...")
        return self.get_key()

gemini_keys = KeyManager("GEMINI_API_KEY")

# --- 2. CONFIGURATION ---
LOCKED_MODEL = "models/gemini-2.5-flash"
print(f"🚀 Project Morrigan: Active with {LOCKED_MODEL}")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def clean_text_output(text: str) -> str:
    """
    Sanitizes the AI response to remove Markdown, bolding, and newlines.
    Returns a clean, single-paragraph string.
    """
    # 1. Remove Markdown Bold/Italic (** or __)
    text = text.replace("**", "").replace("__", "")
    
    # 2. Remove Headers (##)
    text = text.replace("##", "")
    
    # 3. Remove Bullet points (* or - at start of lines)
    text = re.sub(r'^\s*[\*\-]\s+', '', text, flags=re.MULTILINE)
    
    # 4. Remove Newlines (\n) and extra spaces
    # This turns the whole answer into one smooth paragraph.
    # If you WANT lists, remove the .replace('\n', ' ') part.
    clean_paragraph = " ".join(text.split())
    
    return clean_paragraph

def ask_morrigan(query: str):
    retries = 0
    while retries < len(gemini_keys.keys):
        try:
            # Setup current key
            genai.configure(api_key=gemini_keys.get_key())
            model = genai.GenerativeModel(LOCKED_MODEL)

            # A. EMBEDDING
            res = genai.embed_content(
                model="models/gemini-embedding-001",
                content=query,
                task_type="retrieval_query"
            )
            
            # B. SEARCH PINECONE
            results = index.query(
                vector=res['embedding'], 
                top_k=5,
                include_metadata=True
            )
            
            # C. CONTEXT PREPARATION
            context_text = "\n\n".join([
                m['metadata']['text'] 
                for m in results['matches'] 
                if 'text' in m['metadata']
            ])

            if not context_text:
                return "I'm sorry, but I couldn't find any information about that in the current financial blogs."

            # D. THE STRICT PROMPT
            prompt = f"""
            ### SYSTEM ROLE
            You are Morrigan, an expert financial analyst and assistant for the website 'The Morrigan'. 
            Your task is to answer user questions with high precision, professional tone, and absolute accuracy based ONLY on the provided context.

            ### STRICT RULES
            1. **DIRECT ANSWER:** Do NOT start with "The article says," "This text mentions," or "According to the context." Start directly with the answer.
            2. **NO HALLUCINATIONS:** If the answer is not explicitly found in the "CONTEXT" section below, you must say: "I'm sorry, that specific detail is not covered in our current analysis." Do not make up information.
            3. **PROFESSIONAL TONE:** Keep the answer clean, concise, and structured. 
            4. **CONTEXT ONLY:** Ignore your outside knowledge. Your world is limited strictly to the provided context.
            5. **PLAIN TEXT:** Do NOT use markdown (**), headings (###), or bullet points. Write in clear, complete sentences.

            ### CONTEXT (The only truth)
            {context_text}

            ### USER QUESTION
            {query}

            ### YOUR PROFESSIONAL ANSWER:
            """

            # E. GENERATE
            response = model.generate_content(prompt)
            
            # F. CLEANING (The Magic Step)
            # This ensures no ** or \n junk reaches the frontend
            final_answer = clean_text_output(response.text)
            
            return final_answer

        except Exception as e:
            if "429" in str(e):
                gemini_keys.rotate()
                retries += 1
                time.sleep(1)
            else:
                print(f"🚨 System Error: {e}")
                return "I encountered a technical error. Please try again in a moment."
                
    return "High traffic detected. Please wait 60 seconds and try again."