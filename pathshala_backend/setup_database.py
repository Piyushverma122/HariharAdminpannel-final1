import mysql.connector
import sys
import configparser
import os

def load_config():
    """Load database configuration from config.ini"""
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    
    # Default values
    settings = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'harihar',
        'port': 3306
    }
    
    if os.path.exists(config_path):
        try:
            config.read(config_path)
            if 'DATABASE' in config:
                settings['host'] = config.get('DATABASE', 'host', fallback='localhost')
                settings['user'] = config.get('DATABASE', 'user', fallback='root')
                settings['password'] = config.get('DATABASE', 'password', fallback='')
                settings['database'] = config.get('DATABASE', 'database', fallback='harihar')
                settings['port'] = config.getint('DATABASE', 'port', fallback=3306)
                print(f"✅ Loaded configuration from config.ini")
            else:
                print("⚠️  No [DATABASE] section in config.ini, using defaults")
        except Exception as e:
            print(f"⚠️  Error reading config.ini: {e}. Using defaults.")
    else:
        print("⚠️  config.ini not found. Using default values.")
        print("💡 You can create config.ini to customize database settings.")
    
    return settings

def create_database():
    """Create the harihar database if it doesn't exist"""
    settings = load_config()
    
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host=settings['host'],
            user=settings['user'],
            password=settings['password'],
            port=settings['port']
        )
        cursor = connection.cursor()
        
        # Create database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings['database']}")
        print(f"✅ Database '{settings['database']}' created successfully (or already exists)")
        
        cursor.close()
        connection.close()
        
        return True, settings
        
    except mysql.connector.Error as err:
        print(f"❌ Error creating database: {err}")
        if err.errno == 1045:
            print("💡 Tip: Check your MySQL credentials in config.ini")
        return False, settings

def test_connection():
    """Test connection to the harihar database"""
    settings = load_config()
    
    try:
        connection = mysql.connector.connect(
            host=settings['host'],
            user=settings['user'],
            password=settings['password'],
            database=settings['database'],
            port=settings['port']
        )
        cursor = connection.cursor()
        
        # Test query
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print(f"✅ Successfully connected to '{settings['database']}' database")
        print(f"📊 Found {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
            
        cursor.close()
        connection.close()
        
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ Error connecting to database: {err}")
        if err.errno == 1049:
            print(f"💡 Database '{settings['database']}' doesn't exist yet")
        elif err.errno == 1045:
            print("💡 Tip: Check your MySQL credentials in config.ini")
        return False

if __name__ == "__main__":
    print("🔧 Setting up local database...")
    print()
    
    # Step 1: Create database
    success, settings = create_database()
    if success:
        print()
        
        # Step 2: Test connection
        if test_connection():
            print()
            print("🎉 Database setup completed successfully!")
            print()
            print("📝 Next steps:")
            print("1. Run the SQL commands from 'newdatabase_sql.txt' in MySQL Workbench")
            print("   - Connect to your MySQL server in Workbench")
            print(f"   - Select the '{settings['database']}' database")
            print("   - Copy and execute all SQL commands from newdatabase_sql.txt")
            print("2. Install Python dependencies: pip install -r requirements.txt")
            print("3. Start the Flask server: python app.py")
        else:
            print("⚠️  Database created but connection test failed")
    else:
        print("❌ Failed to create database")
        print()
        print("🔧 Troubleshooting:")
        print("1. Make sure MySQL is running")
        print("2. Check your MySQL credentials")
        print("3. Edit config.ini with your MySQL password if needed")
        print("4. Try running this script again")
