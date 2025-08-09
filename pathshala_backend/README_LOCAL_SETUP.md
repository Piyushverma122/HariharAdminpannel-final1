# Harihar Backend - Local Development Setup

This guide will help you set up the Harihar backend to run locally so you can connect it to your MySQL Workbench.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **MySQL Server** running locally (usually port 3306)
3. **MySQL Workbench** for database management

## Quick Setup

### Option 1: Automated Setup (Recommended)
1. Double-click `setup.bat` to automatically install dependencies and set up the database
2. Run the SQL commands from `newdatabase_sql.txt` in MySQL Workbench
3. Double-click `run.bat` to start the server

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 2: Set Up Database
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS harihar;
   ```
4. Select the `harihar` database and run all the SQL commands from `newdatabase_sql.txt`

#### Step 3: Configure Database Connection
The backend is already configured for local development with these settings:
- Host: `localhost`
- User: `root`
- Password: `` (empty - change in `app.py` if your MySQL has a password)
- Database: `harihar`

If your MySQL setup is different, edit the Database class in `app.py` (lines 30-38).

#### Step 4: Start the Server
```bash
python app.py
```

## Server Information

- **Local URL**: http://localhost:5003
- **API Status**: http://localhost:5003/ (should show "API is running")
- **All Data View**: http://localhost:5003/data (HTML view of all data)

## Key Changes Made for Local Development

1. **Database Configuration**: Changed from production to local settings
2. **Database Name**: Updated from `pathshala` to `harihar`
3. **Schema Updates**: Removed `mobile` field from student registration (as per new schema)
4. **Teacher Table**: Disabled teacher-related endpoints (table doesn't exist in new schema)
5. **File Uploads**: Now uses `employee_id` instead of `mobile` for file naming

## Database Schema

The new database has these tables:
- `student`: Stores student information (no mobile field)
- `school`: Stores school information
- `admin`: Simple admin authentication

## API Endpoints

### Student Management
- `POST /register` - Register a new student
- `GET /fetch_student` - Get all students
- `POST /fetch_student` - Get students by UDISE code
- `POST /verify_student` - Verify a student (requires name and employee_id)
- `POST /check_verified_status` - Check unverified students

### School Management
- `GET /fetch_school` - Get all schools
- `POST /login` - School login (UDISE code + password)
- `POST /teacher_dashboard` - Get student count for a school

### File Management
- `GET /uploads/<filename>` - Serve uploaded files
- `POST /get_photo` - Get specific uploaded file

### Web Dashboard
- `GET /web_dashboard` - Get overall statistics
- `GET /data` - HTML view of all data

## Troubleshooting

### Database Connection Issues
1. Make sure MySQL is running
2. Check if the database `harihar` exists
3. Verify MySQL credentials in `app.py`
4. Run `python setup_database.py` to test connection

### Missing Tables
Run the SQL commands from `newdatabase_sql.txt` in MySQL Workbench

### File Upload Issues
Make sure the `uploads/` folder exists (it's created automatically)

## Development Notes

- The backend now runs in development mode (`production_global = False`)
- Debug mode is enabled for detailed error messages
- CORS is enabled for frontend integration
- All database operations include proper error handling

## Frontend Integration

If you're connecting this to a frontend, the base URL is:
```
http://localhost:5003
```

Remember to update any frontend configuration to point to this local URL instead of the production server.
