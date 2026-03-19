#!/usr/bin/env python3
"""Generate a PBKDF2 password hash for the ADMIN_PASSWORD_HASH env variable.

Usage:
    python scripts/generate_password_hash.py <your_password>
    python scripts/generate_password_hash.py
        → Will prompt you interactively
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.auth import get_password_hash

if __name__ == "__main__":
    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        import getpass
        password = getpass.getpass("Enter password to hash: ")

    hashed = get_password_hash(password)
    print(f"\n✅ Password hash generated!\n")
    print(f"Add this to your .env file:")
    print(f"ADMIN_PASSWORD_HASH={hashed}")
