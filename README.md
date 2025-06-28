# Intellect - AI-Powered Quiz Generation Platform

Intellect is a full-stack web application that allows users to generate interactive quizzes from uploaded documents (PDFs, images) or pasted text using AI. Built with React, Firebase, and Tailwind CSS.

## Features

- **Authentication**: Google Sign-in and Email/Password registration
- **Quiz Generation**: Create quizzes from:
  - Pasted text content
  - PDF documents (text extraction)
  - Images (OCR text extraction)
- **AI Integration**: Powered by generative AI to create relevant questions
- **Interactive Quiz Taking**: 
  - Multiple choice questions
  - True/False questions  
  - Fill-in-the-blank questions
  - Instant feedback with explanations
- **Results & Analytics**: Detailed score breakdown and study suggestions
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **AI**: Generative AI API integration (placeholder for Google Gemini/OpenAI)
- **File Processing**: 
  - PDF.js for PDF text extraction
  - Tesseract.js for OCR
- **Deployment**: Ready for Vercel

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd intellect-quiz-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own quizzes
    match /quizzes/{quizId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── QuizListItem.jsx
│   ├── Generator/
│   │   ├── QuizGenerator.jsx
│   │   └── Uploader.jsx
│   ├── Layout/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   └── Quiz/
│       ├── QuizTaker.jsx
│       ├── QuestionCard.jsx
│       └── Results.jsx
├── firebase/
│   └── config.js
├── hooks/
│   └── useAuth.js
├── App.jsx
└── main.jsx
```

## Data Models

### User
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  createdAt: timestamp
}
```

### Quiz
```javascript
{
  quizId: string,
  userId: string,
  sourceTitle: string,
  sourceText: string,
  difficulty: "Easy" | "Medium" | "Hard",
  questions: [
    {
      questionText: string,
      type: "Multiple Choice" | "True/False" | "Fill in the Blank",
      options?: string[], // Only for Multiple Choice
      correctAnswer: string,
      explanation: string
    }
  ],
  createdAt: timestamp
}
```

## AI Integration

The application includes placeholder AI integration. To connect with a real AI service:

1. Replace the `generateQuizWithAI` function in `QuizGenerator.jsx`
2. Implement actual API calls to your chosen AI service (Google Gemini, OpenAI, etc.)
3. Update the prompt engineering for optimal question generation

## File Processing

### PDF Processing
- Uses PDF.js for client-side text extraction
- Supports text-based PDFs (not scanned images)

### Image OCR
- Uses Tesseract.js for optical character recognition
- Works best with high-quality, clear text images

## Deployment

### Vercel (Recommended)

#### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name: **intellect-quiz-app**
   - Directory: **./intellect-quiz-app**
   - Build command: `npm run build`
   - Output directory: `dist`

#### Option 2: Deploy with GitHub (Easier)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/intellect-quiz-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

#### Setting Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_ai_api_key (optional)
```

#### Important Deployment Notes

✅ **vercel.json** is already configured for SPA routing  
✅ **Build configuration** is set up for Vite  
✅ **Environment variables** use VITE_ prefix for client-side access  
✅ **Firebase fallbacks** prevent crashes if env vars are missing  

### 🚀 Quick Deployment Checklist

Before deploying to production:

1. **✅ Test Build Locally**:
   ```bash
   npm run build
   npm run preview
   ```

2. **✅ Set Up Firebase Project** (Required for full functionality):
   - Create project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password + Google)
   - Create Firestore database
   - Copy configuration values

3. **✅ Deploy Options**:
   - **Easy**: Push to GitHub → Connect to Vercel
   - **Direct**: Use Vercel CLI
   - **Alternative**: Netlify, Firebase Hosting, etc.

4. **✅ Configure Environment Variables** in your deployment platform:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **✅ Test Production**: Visit your deployed URL and verify all features work

**⚡ The app will work with demo data even without Firebase setup!**  

### Other Platforms

The app can be deployed to any static hosting service:

- **Netlify**: Use `npm run build` and deploy the `dist` folder
- **Firebase Hosting**: 
  ```bash
  npm run build
  firebase init hosting
  firebase deploy
  ```
- **GitHub Pages**: Use GitHub Actions with Vite build
- **AWS S3 + CloudFront**: Deploy `dist` folder to S3 bucket

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue or contact the development team.

---

**Note**: This application is designed for educational and professional use. Ensure you have proper licenses for any AI services and comply with content usage policies.
