#!/usr/bin/env python3
"""
Database initialization script.
Creates all tables based on SQLAlchemy models.
Usage: python init_database.py
"""

from database.connection import Base, engine, get_db
from database import models
from dotenv import load_dotenv
import os

load_dotenv()

def init_db():
    """Create all database tables"""
    print("🔧 Initializing database...")
    print(f"📍 Connection: {os.getenv('DATABASE_URL', 'Not configured')}")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Verify tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n📊 Created tables: {', '.join(tables)}")
        
        # Test connection
        db = next(get_db())
        db.execute("SELECT 1")
        print("✅ Database connection verified!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure PostgreSQL is running")
        print("2. Check DATABASE_URL in .env file")
        print("3. Verify database 'morrigan' exists: createdb morrigan")
        return False
    
    return True

if __name__ == "__main__":
    success = init_db()
    exit(0 if success else 1)
