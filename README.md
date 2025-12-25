WorkMate - AI-Powered Hiring Platform
A complete, fully working local version of the WorkMate hiring platform with AI-generated images, real-time chat, and intelligent job matching.

🚀 Features
Authentication & User Management
JWT-based authentication with bcrypt password hashing
Role-based access control (Contractor/Job Seeker)
AI-generated avatars for new users
Secure login/signup system
Contractor Dashboard
Post jobs with detailed information (title, description, skills, wage, location, duration)
AI-generated job images based on skills and requirements
View and manage job applications
Accept/reject job seeker applications
Real-time notifications for new applications
Job Seeker Dashboard
Create and manage detailed profiles (skills, experience, location, languages)
AI-generated profile pictures
Browse and search for nearby jobs
Apply for jobs with one-click
Track application status and work history
AI-Powered Features
Smart job matching based on skills, experience, and location
Job seeker recommendations for contractors
Job recommendations for job seekers
Intelligent scoring algorithm with detailed reasoning
Real-time Communication
Socket.io-powered chat system
Instant notifications for applications and updates
Real-time status updates
Internationalization
Multi-language support (English, Hindi, Marathi)
Localized content and user interface
next-intl integration
🛠️ Tech Stack
Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS
Backend: Node.js API routes, Prisma ORM
Database: SQLite (local development)
Authentication: JWT + bcrypt
Real-time: Socket.io
UI Components: shadcn/ui, Lucide React icons
Internationalization: next-intl
AI Images: DiceBear API placeholders (easily replaceable with real AI services)
📋 Prerequisites
Node.js 18+
npm or yarn
Git
🚀 Quick Start
1. Clone and Setup
# Navigate to the project directory
cd workmate

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push
2. Environment Setup
Create a .env.local file in the root directory:

JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL="file:./dev.db"
3. Start Development Server
# Start the development server with Socket.io
npm run dev
The application will be available at http://localhost:3000

🗄️ Database Setup
The application uses SQLite with Prisma ORM. The database will be automatically created when you run:

npm run db:push
To view and manage your database:

npm run db:studio
🌐 Internationalization
The platform supports multiple languages:

English (/en) - Default language
Hindi (/hi) - हिंदी
Marathi (/mr) - मराठी
Language files are located in the messages/ directory and can be easily extended.

🔐 Authentication Flow
Signup: Users can create accounts as either contractors or job seekers
Login: JWT-based authentication with secure password verification
Role-based Access: Different dashboards and permissions based on user role
Session Management: Secure token storage and validation
🤖 AI Features
Job Matching Algorithm
Skill Matching (40-50% weight): Compares job seeker skills with job requirements
Experience Bonus (20-30% weight): Rewards experienced workers
Location Matching (20-30% weight): Prioritizes nearby opportunities
Contractor Rating (10% weight): Considers contractor reputation
Image Generation
User Avatars: Consistent avatars based on user ID and name
Job Images: Skill-specific visual representations
Dashboard Visuals: Context-aware illustrations and charts
📱 API Endpoints
Authentication
POST /api/auth/signup - User registration
POST /api/auth/login - User authentication
Jobs
GET /api/jobs - List all jobs with filtering
POST /api/jobs - Create new job (contractors only)
Applications
GET /api/applications - Get applications for jobs/users
POST /api/applications - Apply for a job (job seekers only)
PATCH /api/applications - Update application status (contractors only)
AI Recommendations
GET /api/ai/recommendations - Get AI-powered suggestions
POST /api/ai/recommendations - Generate new recommendations
🔧 Development
Project Structure
workmate/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       ├── jobs/
│   │       ├── applications/
│   │       └── ai/
│   └── i18n.ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── ai-recommendations.ts
│   └── ai-images.ts
├── messages/
│   ├── en.json
│   ├── hi.json
│   └── mr.json
├── prisma/
│   └── schema.prisma
├── server.js
└── package.json
Adding New Features
Database Models: Update prisma/schema.prisma
API Routes: Create new files in src/app/api/
Frontend Components: Add pages in src/app/[locale]/
Translations: Update language files in messages/
Database Migrations
# After schema changes
npm run db:generate
npm run db:push
🚀 Deployment
Production Build
# Build the application
npm run build

# Start production server
npm start
Environment Variables
Set these in production:

NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
PORT=3000
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request
📄 License
This project is licensed under the MIT License.

🆘 Support
For support and questions:

Check the documentation
Review existing issues
Create a new issue with detailed information
🔮 Future Enhancements
Real AI Integration: Replace placeholder images with actual AI generation
Advanced Analytics: Dashboard metrics and insights
Mobile App: React Native mobile application
Payment Integration: Secure payment processing
Video Calls: Built-in communication features
Machine Learning: Enhanced recommendation algorithms
WorkMate - Connecting talented job seekers with quality work opportunities through AI-powered matching and real-time communication.

About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Report repository
Releases
No releases published
Packages
No packages published
Deployments
7
 Production – workmate-i486
 Production – workmate
 Preview – workmate-i486
+ 4 deployments
Languages
TypeScript
96.9%
 
JavaScript
2.0%
 
Other
1.1%
Footer
