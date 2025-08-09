import mysql.connector
import configparser
import os

def load_config():
    """Load database configuration from config.ini"""
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")
    
    settings = {
        'host': 'localhost',
        'user': 'root',
        'password': 'pass123',
        'database': 'harihar',
        'port': 3306
    }
    
    if os.path.exists(config_path):
        config.read(config_path)
        if 'DATABASE' in config:
            settings['host'] = config.get('DATABASE', 'host', fallback='localhost')
            settings['user'] = config.get('DATABASE', 'user', fallback='root')
            settings['password'] = config.get('DATABASE', 'password', fallback='')
            settings['database'] = config.get('DATABASE', 'database', fallback='harihar')
            settings['port'] = config.getint('DATABASE', 'port', fallback=3306)
    
    return settings

def update_database_schema():
    """Update database to new schema"""
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
        
        print("🔄 Updating database schema...")
        
        # Drop existing tables if they exist
        print("📋 Dropping existing tables...")
        cursor.execute("DROP TABLE IF EXISTS teacher")
        cursor.execute("DROP TABLE IF EXISTS student")
        cursor.execute("DROP TABLE IF EXISTS school")
        cursor.execute("DROP TABLE IF EXISTS admin")
        
        # Create new schema tables
        print("🏗️  Creating new tables...")
        
        # Student table (updated schema)
        cursor.execute("""
        CREATE TABLE student (
            name           VARCHAR(100),
            employee_id    VARCHAR(50),
            school_name    VARCHAR(150),
            class          VARCHAR(20),
            name_of_tree   VARCHAR(100),
            plant_image    VARCHAR(255),
            certificate    VARCHAR(255),
            date_time      DATETIME DEFAULT CURRENT_TIMESTAMP,
            udise_code     VARCHAR(20),
            verified       VARCHAR(10) DEFAULT 'false'
        )
        """)
        print("✅ Student table created")
        
        # School table (unchanged)
        cursor.execute("""
        CREATE TABLE school (
            sno            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            district_code  VARCHAR(10),
            district_name  VARCHAR(100),
            block_name     VARCHAR(100),
            block_code     VARCHAR(20),
            cluster_code   VARCHAR(20),
            cluster_name   VARCHAR(100),
            udise_code     VARCHAR(20),
            school_name    VARCHAR(150),
            password       VARCHAR(255)
        )
        """)
        print("✅ School table created")
        
        # Admin table (simplified)
        cursor.execute("""
        CREATE TABLE admin (
            admin_id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            password       VARCHAR(255) NOT NULL
        )
        """)
        print("✅ Admin table created")
        
        # Insert a default admin user
        cursor.execute("INSERT INTO admin (password) VALUES ('admin123')")
        print("✅ Default admin user created (password: admin123)")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        print("\n🎉 Database schema updated successfully!")
        print("📊 New schema implemented:")
        print("  - Student table (no mobile field)")
        print("  - School table (unchanged)")
        print("  - Admin table (simplified)")
        print("  - Teacher table (removed)")
        
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ Error updating schema: {err}")
        return False

if __name__ == "__main__":
    update_database_schema()
