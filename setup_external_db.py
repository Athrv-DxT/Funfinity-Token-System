#!/usr/bin/env python3
"""
Script to set up PostgreSQL database for Token Wallet
Run this on your local machine where PostgreSQL will be hosted
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def setup_external_database():
    # Database configuration
    DB_NAME = "token_wallet"
    DB_USER = "wallet_user"
    DB_PASSWORD = "wallet_secure_2024"
    
    print("🚀 Setting up PostgreSQL database for Token Wallet...")
    print("=" * 60)
    
    try:
        # Connect to PostgreSQL as superuser
        print("📡 Connecting to PostgreSQL...")
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",  # Connect to default database
            user="postgres",      # Default superuser
            password=input("Enter PostgreSQL superuser password: ")
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database
        print(f"🗄️  Creating database '{DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE {DB_NAME};")
        print(f"✅ Database '{DB_NAME}' created successfully")
        
        # Create user
        print(f"👤 Creating user '{DB_USER}'...")
        cursor.execute(f"CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}';")
        print(f"✅ User '{DB_USER}' created successfully")
        
        # Grant privileges
        print("🔐 Granting privileges...")
        cursor.execute(f"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};")
        print(f"✅ Privileges granted to '{DB_USER}'")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("🎉 EXTERNAL DATABASE SETUP COMPLETE!")
        print("="*60)
        print(f"📊 Database Name: {DB_NAME}")
        print(f"👤 Database User: {DB_USER}")
        print(f"🔑 Database Password: {DB_PASSWORD}")
        print(f"🌐 Host: localhost (or your machine's IP)")
        print(f"🔌 Port: 5432")
        print("\n📝 Next steps:")
        print("1. Configure PostgreSQL to accept external connections (see POSTGRESQL_SETUP.md)")
        print("2. Update your .env file with these credentials")
        print("3. Deploy to Railway with external database URL")
        print("\n💡 Your DATABASE_URL should be:")
        print(f"postgresql://{DB_USER}:{DB_PASSWORD}@YOUR_IP:5432/{DB_NAME}")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure PostgreSQL is installed and running")
        print("2. Check if the 'postgres' user password is correct")
        print("3. Ensure PostgreSQL is listening on localhost:5432")

if __name__ == "__main__":
    setup_external_database()
