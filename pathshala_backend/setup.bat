@echo off
echo Setting up Harihar Backend for Local Development
echo ================================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt
echo.

echo Setting up database...
python setup_database.py
echo.

echo Setup completed!
echo.
echo To start the server, run: python app.py
pause
