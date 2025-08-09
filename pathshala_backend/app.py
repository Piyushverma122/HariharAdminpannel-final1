from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime
import configparser


# --- Configuration ---
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Read database configuration from config.ini
config = configparser.ConfigParser()
config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.ini")

# Default values
database_name = 'harihar'
mysql_host = 'localhost'
mysql_user = 'root'
mysql_password = ''
mysql_port = 3306

# Try to read from config file
if os.path.exists(config_path):
    try:
        config.read(config_path)
        if 'DATABASE' in config:
            mysql_host = config.get('DATABASE', 'host', fallback='localhost')
            mysql_user = config.get('DATABASE', 'user', fallback='root')
            mysql_password = config.get('DATABASE', 'password', fallback='')
            database_name = config.get('DATABASE', 'database', fallback='harihar')
            mysql_port = config.getint('DATABASE', 'port', fallback=3306)
            print(f"[CONFIG] Loaded database configuration from config.ini")
    except Exception as e:
        print(f"[CONFIG] Error reading config.ini: {e}. Using defaults.")
else:
    print(f"[CONFIG] config.ini not found. Using default values.")

# a = int(input("Enter 1 for production and 0 for local development: "))
# production_global = True if a == 1 else False
production_global = False  # Changed to False for local development 

app = Flask(__name__, static_folder=UPLOAD_FOLDER, static_url_path='/static')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Remove production server config for local development
# if production_global:
#     app.config['SERVER_NAME'] = 'http://165.22.208.62:5003'
#     app.config['PREFERRED_URL_SCHEME'] = 'http'

# --- Database Class ---
class Database:
    def __init__(self, host=None, user=None, password=None, database=None, production=False):
        global production_global, mysql_host, mysql_user, mysql_password, database_name, mysql_port
        production = production_global
        
        if production:
            # Production settings (kept for reference)
            self.host = '127.0.0.1'
            self.user = 'root'
            self.password = 'Ssipmt@2025DODB'
            self.database = database_name
            self.port = 3306
            print("[DB Config] Using PRODUCTION database settings.")
        else:
            # Local development settings from config
            self.host = host or mysql_host
            self.user = user or mysql_user
            self.password = password or mysql_password
            self.database = database or database_name
            self.port = mysql_port
            print(f"[DB Config] Using LOCAL database settings: {self.user}@{self.host}:{self.port}/{self.database}")

        self.connection = None
        self.cursor = None
        self._connected = False
        self.connect()

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            self.cursor = self.connection.cursor(dictionary=True)
            self._connected = True
        except mysql.connector.Error as err:
            self.connection = None
            self.cursor = None
            self._connected = False

    def is_connected(self):
        return self._connected and self.connection is not None and self.connection.is_connected()

    def execute(self, query, params=None):
        if not self.is_connected():
            return None
        try:
            if self.cursor.with_rows:
                self.cursor.fetchall()

            self.cursor.execute(query, params)

            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP')):
                self.connection.commit()

            return self.cursor
        except mysql.connector.Error as err:
            if self.connection and self.connection.is_connected():
                self.connection.rollback()
            return None
        except Exception as e:
            if self.connection and self.connection.is_connected():
                self.connection.rollback()
            return None

    def fetchall(self):
        if not self.is_connected() or not self.cursor:
            return []
        return self.cursor.fetchall()

    def fetchone(self):
        if not self.is_connected() or not self.cursor:
            return None
        return self.cursor.fetchone()

    def close(self):
        if self.cursor:
            self.cursor.close()
            self.cursor = None
        if self.connection:
            self.connection.close()
            self.connection = None
        self._connected = False

# --- Helper Functions ---
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- API Routes ---

@app.route('/')
def index():
    return '<html style="text-align: center; background-color: #000;"><h1 style="color:#fff;"> API is running </h1></html>'

@app.route('/fetch_school', methods=['GET'])
def fetch_school():
    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    query = 'SELECT * FROM school'
    cursor = db.execute(query)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while fetching school data."
        }), 500

    schools = cursor.fetchall()
    return jsonify({
        "status": True,
        "message": "School data fetched successfully.",
        "data": schools
    }), 200

@app.route('/data', methods=['GET'])
def show_all_students():
    db = Database()
    result = db.execute("SELECT * FROM student")
    students = result.fetchall()
    table_headers = students[0].keys() if students else []

    result1 = db.execute("SELECT * FROM school")
    schools = result1.fetchall()
    table_headers2 = schools[0].keys() if schools else []
    
    result2 = db.execute("SELECT * FROM admin")
    admins = result2.fetchall()
    table_headers3 = admins[0].keys() if admins else []
    
    html = """
    <html>
    <head>
        <title>All Data - Pathshala</title>
        <style>
            body { background-color: #121212; color: #fff; font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #1f1f1f; }
            tr:nth-child(even) { background-color: #2a2a2a; }
            tr:hover { background-color: #3a3a3a; }
        </style>
    </head>
    <body>
        <h1>All Registered Students of Pathshala</h1>
        <table>
            <tr>""" + "".join(f"<th>{col}</th>" for col in table_headers) + "</tr>"

    for row in students:
        html += "<tr>" + "".join(f"<td>{row[col]}</td>" for col in table_headers) + "</tr>"

    html += """
        </table>
        <h1>All Registered Schools</h1>
        <table>
            <tr>""" + "".join(f"<th>{col}</th>" for col in table_headers2) + "</tr>"
    for row in schools:
        html += "<tr>" + "".join(f"<td>{row[col]}</td>" for col in table_headers2) + "</tr>"

    html += """
        </table>
        <h1>Admin Users</h1>
        <table>
            <tr>""" + "".join(f"<th>{col}</th>" for col in table_headers3) + "</tr>"
    for row in admins:
        html += "<tr>" + "".join(f"<td>{row[col]}</td>" for col in table_headers3) + "</tr>"

    html += """
        </table>
    </body>
    </html>
    """

    return Response(html, mimetype='text/html')

@app.route('/admin_login', methods=['POST'])
def admin_login():
    data = request.get_json()
    db = None
    try:
        admin_id = data.get('admin_id')
        password = data.get('password')
        
        if not admin_id or not password:
            return jsonify({
                "status": False,
                "message": "Admin ID and password required"
            }), 400

        db = Database()
        if not db.is_connected():
            return jsonify({
                "status": False,
                "message": "Server is unable to connect to the database. Please check server logs."
            }), 500

        cursor = db.execute("SELECT * FROM admin WHERE admin_id = %s AND password = %s", (admin_id, password))

        if cursor is None:
            return jsonify({
                "status": False,
                "message": "An error occurred during query execution. Check server logs for details."
            }), 500

        result = cursor.fetchone()

        try:
            if cursor.with_rows:
                cursor.fetchall()
        except Exception as e:
            pass

        if result:
            return jsonify({
                "status": True,
                "message": "Admin login successful",
                "data": {"admin_id": result['admin_id']}
            }), 200
        else:
            return jsonify({
                "status": False,
                "message": "Invalid admin ID or password"
            }), 401
    except mysql.connector.Error as err:
        print(f"[ADMIN LOGIN ERROR] MySQL error: {err}")
        return jsonify({
            "status": False,
            "message": "Database error during admin login. Please check server logs."
        }), 500
    finally:
        if db:
            db.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = None
    try:
        udise_code = data.get('udise_code')
        password = data.get('password')
        if not udise_code or not password:
            return jsonify({
                "status": False,
                "message": "UDISE code and password required"
            }), 400

        db = Database()
        if not db.is_connected():
            return jsonify({
                "status": False,
                "message": "Server is unable to connect to the database. Please check server logs."
            }), 500

        cursor = db.execute("SELECT * FROM school WHERE udise_code = %s AND password = %s", (udise_code, password))

        if cursor is None:
            return jsonify({
                "status": False,
                "message": "An error occurred during query execution. Check server logs for details."
            }), 500

        result = cursor.fetchone()

        try:
            if cursor.with_rows:
                cursor.fetchall()
        except Exception as e:
            pass

        if result:
            return jsonify({
                "status": True,
                "message": "Login successful",
                "data": result
            }), 200
        else:
            return jsonify({
                "status": False,
                "message": "Invalid username or password"
            }), 401
    except mysql.connector.Error as err:
        print(f"[LOGIN ERROR] MySQL error: {err}")
        return jsonify({
            "status": False,
            "message": "Database error during login. Please check server logs."
        }), 500
    finally:
        if db:
            db.close()

@app.route('/register', methods=['POST'])
def register():
    db = None
    try:
        print(f"[REGISTRATION] Starting registration process...")
        print(f"[REGISTRATION] Form fields received: {list(request.form.keys())}")
        print(f"[REGISTRATION] Files received: {list(request.files.keys())}")
        
        required_fields = ['name', 'school_name', 'class', 'name_of_tree', 'udise_code', 'dinank']
        for field in required_fields:
            if field not in request.form:
                print(f"[REGISTRATION ERROR] Missing field: {field}")
                return jsonify({
                    "status": False,
                    "message": f"Missing required form field: {field}"
                }), 400

        name = request.form['name']
        school_name = request.form['school_name']
        student_class = request.form['class']
        name_of_tree = request.form['name_of_tree']
        udise_code = request.form['udise_code']
        dinank = request.form['dinank']
        
        print(f"[REGISTRATION] Form data extracted:")
        print(f"  name: {name}")
        print(f"  school_name: {school_name}")
        print(f"  class: {student_class}")
        print(f"  name_of_tree: {name_of_tree}")
        print(f"  udise_code: {udise_code}")
        print(f"  dinank: {dinank}")

        plant_image_file = request.files.get('plant_image')
        certificate_file = request.files.get('certificate')
        
        print(f"[REGISTRATION] Files:")
        print(f"  plant_image: {plant_image_file.filename if plant_image_file else 'None'}")
        print(f"  certificate: {certificate_file.filename if certificate_file else 'None'}")

        plant_image_path = None
        if plant_image_file and allowed_file(plant_image_file.filename):
            original_extension = plant_image_file.filename.rsplit('.', 1)[1].lower()
            plant_image_string_part = "plantimage"
            # Replace hyphens with underscores for filename compatibility
            safe_dinank = dinank.replace('-', '_')
            filename_plant = f"{secure_filename(name)}_{safe_dinank}_{plant_image_string_part}.{original_extension}"
            plant_image_full_path = os.path.join(UPLOAD_FOLDER, filename_plant)
            plant_image_file.save(plant_image_full_path)
            plant_image_path = os.path.join("uploads", filename_plant)
        else:
            return jsonify({
                "status": False,
                "message": "Plant image file is missing or has an unsupported format (allowed: png, jpg, jpeg, gif)"
            }), 400

        certificate_path = None
        if certificate_file and allowed_file(certificate_file.filename):
            original_extension = certificate_file.filename.rsplit('.', 1)[1].lower()
            certificate_string_part = "certificateimage"
            # Replace hyphens with underscores for filename compatibility
            safe_dinank = dinank.replace('-', '_')
            filename_certificate = f"{secure_filename(name)}_{safe_dinank}_{certificate_string_part}.{original_extension}"
            certificate_full_path = os.path.join(UPLOAD_FOLDER, filename_certificate)
            certificate_file.save(certificate_full_path)
            certificate_path = os.path.join("uploads", filename_certificate)
        else:
            return jsonify({
                "status": False,
                "message": "Certificate file is missing or has an an unsupported format (allowed: png, jpg, jpeg, gif)"
            }), 400

        db = Database()
        if not db.is_connected():
            return jsonify({
                "status": False,
                "message": "Server is unable to connect to the database for registration."
            }), 500

        verified = 'false'
        query = """
        INSERT INTO student (name, school_name, class, name_of_tree, plant_image, certificate, udise_code, verified, date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            name,
            school_name,
            student_class,
            name_of_tree,
            plant_image_path,
            certificate_path,
            udise_code,
            verified,
            dinank
        )
        
        print(f"[REGISTRATION] Executing SQL query:")
        print(f"  Query: {query}")
        print(f"  Params: {params}")

        cursor = db.execute(query, params)

        if cursor is None:
            return jsonify({
                "status": False,
                "message": "Failed to register student due to database error. Check server logs."
            }), 500

        if cursor.rowcount == 1:
            return jsonify({
                "status": True,
                "message": "Student registered successfully!",
                "data": {
                    "name": name,
                    "date": dinank,
                    "plant_image_url": plant_image_path,
                    "certificate_url": certificate_path
                }
            }), 201
        else:
            return jsonify({
                "status": False,
                "message": "Student registration failed for unknown reasons."
            }), 500

    except Exception as e:
        print(f"[REGISTER ERROR] Unhandled exception: {str(e)}")
        return jsonify({
            "status": False,
            "message": f"Server error during registration: {str(e)}"
        }), 500
    finally:
        if db:
            db.close()

@app.route('/teacher_dashboard', methods=['POST'])
def teacher_dashboard():
    data = request.get_json()
    udise_code = data.get('udise_code')

    if not udise_code:
        return jsonify({
            "status": False,
            "message": "UDISE code is required."
        }), 400

    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    query = "SELECT COUNT(*) FROM student WHERE udise_code = %s"
    params = (udise_code,)
    cursor = db.execute(query, params)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while fetching student data."
        }), 500
    result = cursor.fetchone()

    try:
        if cursor.with_rows:
            cursor.fetchall()
    except Exception as e:
        print(f"[WARNING] Error consuming remaining results: {e}")
    actual_count = result['COUNT(*)'] if result else -1

    # Get school information for this UDISE code
    school_query = "SELECT school_name FROM school WHERE udise_code = %s LIMIT 1"
    school_cursor = db.execute(school_query, (udise_code,))
    school_result = school_cursor.fetchone() if school_cursor else None
    school_name = school_result['school_name'] if school_result else None

    if result:
        return jsonify({
            "status": True,
            "message": "Total Count of Students of Udise Code {} fetched successfully".format(udise_code),
            "COUNT": actual_count,
            "school_name": school_name
        }), 200
    else:
        return jsonify({
            "status": False,
            "message": "Invalid UDISE code."
        }), 401

@app.route('/fetch_student', methods=['POST','GET'])
def fetch_student():
    if request.method == 'POST':
        data=request.get_json()
        udise_code = data.get('udise_code')
        db = Database()
        query = 'SELECT * FROM student WHERE udise_code = %s'
        params = (udise_code,)
        results = db.execute(query, params)
        if results is None:
            return jsonify({
                "status": False,
                "message": "An error occurred while fetching student data."
            }), 500
        students = results.fetchall()
        return jsonify({
            "status": True,
            "message": "Student data fetched successfully.",
            "data": students
        }), 200
    else:
        db = Database()
        query = 'SELECT * FROM student'
        cursor = db.execute(query)
        if cursor is None:
            return jsonify({
                "status": False,
                "message": "An error occurred while fetching student data."
            }), 500
        students = cursor.fetchall()
        return jsonify({
            "status": True,
            "message": "All student data fetched successfully.",
            "data": students
        }), 200

@app.route('/uploads/<filename>', methods=['GET','POST'])
def uploaded_file(filename):
    try:
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            filename,
            as_attachment=True
        )
    except Exception as e:
        print(f"[UPLOAD ERROR] {str(e)}")
        return jsonify({
            "status": False,
            "message": f"Error retrieving file: {str(e)}"
        }), 500

@app.route('/get_photo', methods=['POST'])
def get_photo():
    data = request.get_json()
    file_name = data.get('file_name')
    if not file_name:
        return jsonify({
            "status": False,
            "message": "File name is required."
        }), 400

    try:
        return send_from_directory(
            directory=app.config['UPLOAD_FOLDER'],
            path=file_name,
            as_attachment=True
        )
    except Exception as e:
        print(f"[GET_PHOTO ERROR] {str(e)}")
        return jsonify({
            "status": False,
            "message": f"Error retrieving file: {str(e)}"
        }), 500

@app.route('/check_verified_status', methods=['POST'])
def check_student():
    data=request.get_json()
    udise_code = data.get('udise_code')
    if not udise_code:
        return jsonify({
            "status": False,
            "message": "UDISE code is required."
        }), 400

    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    query = "SELECT * FROM student WHERE udise_code = %s AND verified = 'false'"
    params = (udise_code,)
    cursor = db.execute(query, params)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while verifying the student."
        }), 500
    students = cursor.fetchall()

    return jsonify({
        "status": True,
        "message": "Unverified students fetched successfully.",
        "data": students
    }), 200

@app.route('/verify_student', methods=['POST'])
def verify_student():
    data = request.get_json()
    name = data.get('name')
    employee_id = data.get('employee_id')

    if not name or not employee_id:
        return jsonify({
            "status": False,
            "message": "Name and employee ID are required."
        }), 400

    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    query = "UPDATE student SET verified = 'true' WHERE name = %s AND employee_id = %s"
    params = (name, employee_id)
    cursor = db.execute(query, params)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while verifying the student."
        }), 500

    if cursor.rowcount == 1:
        return jsonify({
            "status": True,
            "message": "Student verified successfully."
        }), 200
    else:
        return jsonify({
            "status": False,
            "message": "No student found with the provided details or already verified."
        }), 404

@app.route('/update_student_verification', methods=['POST'])
def update_student_verification():
    data = request.get_json()
    employee_id = data.get('employee_id')
    verified_status = data.get('verified')
    name = data.get('name')
    udise_code = data.get('udise_code')

    if verified_status is None:
        return jsonify({
            "status": False,
            "message": "Verification status is required."
        }), 400

    # Validate verification status
    if verified_status not in ['true', 'false']:
        return jsonify({
            "status": False,
            "message": "Verification status must be 'true' or 'false'."
        }), 400

    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    # Try to update using employee_id first, then fallback to name + udise_code
    if employee_id:
        query = "UPDATE student SET verified = %s WHERE employee_id = %s"
        params = (verified_status, employee_id)
    elif name and udise_code:
        query = "UPDATE student SET verified = %s WHERE name = %s AND udise_code = %s"
        params = (verified_status, name, udise_code)
    else:
        return jsonify({
            "status": False,
            "message": "Either employee_id or both name and udise_code are required."
        }), 400

    cursor = db.execute(query, params)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while updating student verification status."
        }), 500

    if cursor.rowcount >= 1:
        return jsonify({
            "status": True,
            "message": f"Student verification status updated to {verified_status} successfully."
        }), 200
    else:
        return jsonify({
            "status": False,
            "message": "No student found with the provided information."
        }), 404

@app.route('/fetch_teacher', methods=['POST', 'GET'])
def fetch_teacher():
    # Teacher table no longer exists in new database schema
    return jsonify({
        "status": False,
        "message": "Teacher functionality is not available in the current database schema.",
        "data": []
    }), 404

    # Original code commented out:
    # db = Database()

    # if request.method == 'GET':
    #     query = 'SELECT * FROM teacher'
    #     cursor = db.execute(query)

    #     if cursor is None:
    #         return jsonify({
    #             "status": False,
    #             "message": "An error occurred while fetching teacher data."
    #         }), 500

    #     teachers = cursor.fetchall()

    #     enriched_teachers = []
    #     for teacher in teachers:
    #         emp_id = teacher.get("employee_id")

    #         count_query = "SELECT COUNT(*) AS student_count FROM student WHERE employee_id = %s"
    #         count_cursor = db.execute(count_query, (emp_id,))

    #         if count_cursor:
    #             count_row = count_cursor.fetchone()
    #             count = count_row.get('student_count', 0) if count_row else 0
    #         else:
    #             count = 0

    #         teacher["student_count"] = count
    #         enriched_teachers.append(teacher)

    #     return jsonify({
    #         "status": True,
    #         "message": "Teacher data fetched successfully.",
    #         "data": enriched_teachers
    #     }), 200
    # else:
    #     data = request.get_json()
    #     udise_code = data.get('udise_code')

    #     if not udise_code:
    #         return jsonify({
    #             "status": False,
    #             "message": "UDISE code is required."
    #         }), 400

    #     db = Database()
    #     if not db.is_connected():
    #         return jsonify({
    #             "status": False,
    #             "message": "Server is unable to connect to the database. Please check server logs."
    #         }), 500

    #     query = 'SELECT * FROM teacher WHERE udise_code = %s'
    #     params = (udise_code,)
    #     results = db.execute(query, params)

    #     if results is None:
    #         return jsonify({
    #             "status": False,
    #             "message": "An error occurred while fetching teacher data."
    #         }), 500

    #     teachers = results.fetchall()
    #     return jsonify({
    #         "status": True,
    #         "message": "Teacher data fetched successfully.",
    #         "data": teachers
    #     }), 200

# ================================  WEB API  ===================================

@app.route('/web_dashboard', methods=['GET'])
def web_dashboard():
    db = Database()
    if not db.is_connected():
        return jsonify({
            "status": False,
            "message": "Server is unable to connect to the database. Please check server logs."
        }), 500

    query = "SELECT COUNT(*) AS total_students FROM student"
    cursor = db.execute(query)

    if cursor is None:
        return jsonify({
            "status": False,
            "message": "An error occurred while fetching student count."
        }), 500

    result = cursor.fetchone()
    try:
        if cursor.with_rows:
            cursor.fetchall()

    except Exception as e:
        print(f"[WARNING] Error consuming remaining results: {e}")

    total_students = result['total_students'] if result else 0

    # Get total schools count
    query_schools = "SELECT COUNT(*) as total_schools FROM school"
    cursor_schools = db.execute(query_schools)
    result_schools = cursor_schools.fetchall()

    # Get total admins count
    query_admins = "SELECT COUNT(*) as total_admins FROM admin"
    cursor_admins = db.execute(query_admins)
    result_admins = cursor_admins.fetchall()

    # Get total plant images count
    query_plant_images = "SELECT COUNT(*) as total_plant_images FROM student WHERE plant_image IS NOT NULL AND plant_image != ''"
    cursor_plant_images = db.execute(query_plant_images)
    result_plant_images = cursor_plant_images.fetchall()

    return jsonify({
        "status": True,
        "message": "Dashboard data fetched successfully.",
        "total_students": total_students,
        "total_schools": result_schools[0]['total_schools'] if result_schools else 0,
        "total_admins": result_admins[0]['total_admins'] if result_admins else 0,
        "total_plant_images": result_plant_images[0]['total_plant_images'] if result_plant_images else 0
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)