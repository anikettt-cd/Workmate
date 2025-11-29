Write-Host "Setting up WorMate - AI-Powered Labour Hiring Platform" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "2. Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "3. Creating database..." -ForegroundColor Yellow
npx prisma db push

Write-Host ""
Write-Host "4. Setup complete! Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to start the server..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

npm run dev
