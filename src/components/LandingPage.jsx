import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-indigo-600">Intellect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your documents into interactive quizzes with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Text Input</h3>
            <p className="text-gray-600">Paste any text content and generate relevant quiz questions instantly</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Upload</h3>
            <p className="text-gray-600">Extract text from PDFs and create comprehensive quizzes</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Image OCR</h3>
            <p className="text-gray-600">Convert images with text into interactive learning materials</p>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition duration-200"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>✨ Powered by AI • 🔒 Secure • 📱 Responsive Design</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 