@echo off
echo Setting up WorMate - AI-Powered Labour Hiring Platform
echo ======================================================

echo.
echo 1. Installing dependencies...
npm install

echo.
echo 2. Generating Prisma client...
npx prisma generate

echo.
echo 3. Creating database...
npx prisma db push

echo.
echo 4. Setup complete! Starting development server...
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Press any key to start the server...
pause >nul

npm run dev
