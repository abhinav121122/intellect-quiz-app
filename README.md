# Intellect Quiz App

An AI-powered quiz generator that transforms documents and text into interactive quizzes using modern web technologies.

## Features

- 🤖 **AI-Powered Quiz Generation**: Upload documents or paste text to automatically generate quizzes
- 📄 **Document Support**: Supports various document formats for quiz creation
- 🎯 **Interactive Quiz Taking**: Clean, modern interface for taking quizzes
- 📊 **Results & Analytics**: View quiz results and performance metrics
- 🔐 **User Authentication**: Secure user accounts with Firebase Auth
- ☁️ **Cloud Storage**: Store quizzes and user data in Firebase Firestore

## Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **AI Integration**: Custom quiz generation API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhinav121122/intellect-quiz-app.git
cd intellect-quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Follow the instructions in `FIREBASE_SETUP.md`
   - Create a `.env` file with your Firebase config

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # User dashboard
│   ├── Generator/      # Quiz generation tools
│   ├── Layout/         # Navigation and layout
│   └── Quiz/           # Quiz taking interface
├── firebase/           # Firebase configuration
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - Abhinav Singh

Project Link: [https://github.com/abhinav121122/intellect-quiz-app](https://github.com/abhinav121122/intellect-quiz-app)
