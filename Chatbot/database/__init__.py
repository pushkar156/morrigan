from .connection import engine, Base, get_db
from .models import Blog, ChatSession, ChatMessage

# Create all tables in the database
print("Creating database tables....")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")