#!/usr/bin/env python3
"""
Script to set up Railway PostgreSQL database for Token Wallet
Run this locally to create tables on Railway's database
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def setup_railway_database():
    print("🚀 Setting up Railway PostgreSQL database for Token Wallet...")
    print("=" * 60)
    
    # Get Railway database URL from environment or user input
    railway_db_url = os.environ.get("RAILWAY_DATABASE_URL")
    if not railway_db_url:
        railway_db_url = input("Enter Railway DATABASE_URL: ").strip()
    
    if not railway_db_url:
        print("❌ No DATABASE_URL provided!")
        return
    
    try:
        # Connect to Railway PostgreSQL
        print("📡 Connecting to Railway PostgreSQL...")
        conn = psycopg2.connect(railway_db_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        db_name = "token_wallet"
        print(f"🗄️  Creating database '{db_name}' if it doesn't exist...")
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        if not cursor.fetchone():
            cursor.execute(f"CREATE DATABASE {db_name};")
            print(f"✅ Database '{db_name}' created successfully")
        else:
            print(f"✅ Database '{db_name}' already exists")
        
        # Connect to the specific database
        conn.close()
        # Update URL to use the specific database
        if "/railway" in railway_db_url:
            db_url = railway_db_url.replace("/railway", f"/{db_name}")
        else:
            db_url = railway_db_url
        
        conn = psycopg2.connect(db_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create user if it doesn't exist
        user_name = "wallet_user"
        user_password = "wallet_secure_2024"
        print(f"👤 Creating user '{user_name}' if it doesn't exist...")
        cursor.execute(f"SELECT 1 FROM pg_roles WHERE rolname = '{user_name}'")
        if not cursor.fetchone():
            cursor.execute(f"CREATE USER {user_name} WITH PASSWORD '{user_password}';")
            print(f"✅ User '{user_name}' created successfully")
        else:
            print(f"✅ User '{user_name}' already exists")
        
        # Grant privileges
        print("🔐 Granting privileges...")
        cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {db_name} TO {user_name};")
        cursor.execute(f"GRANT ALL ON SCHEMA public TO {user_name};")
        cursor.execute(f"GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {user_name};")
        cursor.execute(f"GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO {user_name};")
        print(f"✅ Privileges granted to '{user_name}'")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("🎉 RAILWAY DATABASE SETUP COMPLETE!")
        print("="*60)
        print(f"📊 Database Name: {db_name}")
        print(f"👤 Database User: {user_name}")
        print(f"🔑 Database Password: {user_password}")
        print(f"🌐 Railway Database URL: {db_url}")
        print("\n📝 Update your Railway environment variables:")
        print(f"DATABASE_URL={db_url}")
        print("DB_POOL_SIZE=15")
        print("DB_MAX_OVERFLOW=5")
        print("GUNICORN_WORKERS=2")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Railway PostgreSQL is running")
        print("2. Check if the DATABASE_URL is correct")
        print("3. Ensure you have the right permissions")

if __name__ == "__main__":
    setup_railway_database()
