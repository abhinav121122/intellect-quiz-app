# Firebase Setup Guide

## 🔥 Getting Firebase API Keys

### Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"**
3. **Enter project name**: `intellect-quiz-app` (or any name you prefer)
4. **Enable Google Analytics**: Optional, you can skip this
5. **Click "Create project"**

### Step 2: Enable Authentication

1. **In your Firebase project**, click **"Authentication"** in the left sidebar
2. **Click "Get started"**
3. **Go to "Sign-in method" tab**
4. **Enable these providers**:
   - **Email/Password**: Click → Enable → Save
   - **Google**: Click → Enable → Enter support email → Save

### Step 3: Create Firestore Database

1. **Click "Firestore Database"** in the left sidebar
2. **Click "Create database"**
3. **Start in production mode** (we'll configure rules later)
4. **Choose location**: Select closest to your users (e.g., us-central1)

### Step 4: Configure Security Rules

1. **In Firestore**, go to **"Rules"** tab
2. **Replace the rules** with this:

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
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. **Click "Publish"**

### Step 5: Get Configuration Keys

1. **Go to Project Settings** (gear icon in sidebar)
2. **Scroll down to "Your apps"**
3. **Click "Web" icon** (</>) to add web app
4. **Enter app nickname**: `intellect-quiz-web`
5. **Don't check "Firebase Hosting"**
6. **Click "Register app"**
7. **Copy the configuration object** - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // ← VITE_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com", // ← VITE_FIREBASE_AUTH_DOMAIN
  projectId: "project-id", // ← VITE_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com", // ← VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // ← VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123" // ← VITE_FIREBASE_APP_ID
};
```

## 🤖 AI API Keys (Optional - for Real Quiz Generation)

### Option 1: Google Gemini API (Recommended)

1. **Go to**: https://makersuite.google.com/app/apikey
2. **Click "Create API Key"**
3. **Select or create a project**
4. **Copy the API key** → Use as `VITE_GEMINI_API_KEY`

### Option 2: OpenAI API

1. **Go to**: https://platform.openai.com/api-keys
2. **Click "Create new secret key"**
3. **Copy the key** → Use as `VITE_OPENAI_API_KEY`

## 🚀 Add Keys to Vercel

### Method 1: Vercel Dashboard

1. **Go to your Vercel project dashboard**
2. **Click "Settings"**
3. **Click "Environment Variables"**
4. **Add these variables**:

```env
VITE_FIREBASE_API_KEY=AIza... (from Firebase config)
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
VITE_GEMINI_API_KEY=your_gemini_key (optional)
```

5. **Redeploy**: Go to "Deployments" → Click "..." on latest → "Redeploy"

### Method 2: Vercel CLI

```bash
vercel env add VITE_FIREBASE_API_KEY
# Enter your Firebase API key when prompted
# Repeat for all environment variables
```

## 🎯 Testing Your Deployment

After adding environment variables:

1. **Visit your Vercel URL**
2. **Click "Sign Up"** to test authentication
3. **Try creating a quiz** to test database
4. **Check browser console** for any errors

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase: No Firebase App"**
   - Check all VITE_ environment variables are set
   - Ensure no typos in variable names

2. **Authentication not working**
   - Add your Vercel domain to Firebase Auth authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `your-app.vercel.app`

3. **Database permission denied**
   - Check Firestore security rules are correctly set
   - Ensure user is authenticated before accessing database

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Environment variables added to Vercel
- [ ] App redeployed
- [ ] Registration/login working
- [ ] Quiz creation working

## 🎉 You're Done!

Your app now has:
- ✅ Real user authentication
- ✅ Persistent data storage
- ✅ Secure access controls
- ✅ Production-ready deployment

Optional: Add AI API keys for real quiz generation instead of demo questions! 