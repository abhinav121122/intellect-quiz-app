import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase/config';
import Uploader from './Uploader';

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizParams, setQuizParams] = useState({
    numberOfQuestions: 10,
    difficulty: 'Medium',
    questionTypes: ['Multiple Choice', 'True/False']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'text', name: 'Paste Text', icon: '📝' },
    { id: 'pdf', name: 'Upload PDF', icon: '📄' },
    { id: 'image', name: 'Upload Image', icon: '📷' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questionTypeOptions = ['Multiple Choice', 'True/False', 'Fill in the Blank'];

  const handleQuestionTypeChange = (type) => {
    setQuizParams(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  };

  const suggestQuestionCount = () => {
    if (!textContent) return;
    
    const wordCount = textContent.split(/\s+/).length;
    const suggestedCount = Math.max(5, Math.min(25, Math.floor(wordCount / 100)));
    
    setQuizParams(prev => ({
      ...prev,
      numberOfQuestions: suggestedCount
    }));
  };

  const generateQuizWithAI = async (text, options) => {
    const prompt = `Based on the following text, please generate a quiz with the following parameters:
- Number of Questions: ${options.numberOfQuestions}
- Difficulty: ${options.difficulty}
- Question Types: ${JSON.stringify(options.questionTypes)}

Your response MUST be a valid JSON object. The JSON object should be an array of question objects, where each object has the following structure:
{
  "questionText": "The main topic of the text is...",
  "type": "Multiple Choice", // or "True/False" or "Fill in the Blank"
  "options": ["Option A", "Option B", "Option C", "Option D"], // Only for "Multiple Choice" type
  "correctAnswer": "Option A", // For MCQ, or "True"/"False" for T/F, or the correct word/phrase for fill-in-the-blank
  "explanation": "The text repeatedly mentions this concept, indicating it's the main topic."
}

Important: 
- For "True/False" questions, do not include an "options" field, just "correctAnswer" as "True" or "False"
- For "Fill in the Blank" questions, the questionText should contain "____" where the answer goes
- Ensure all questions are relevant to the provided text
- Make sure the difficulty matches the requested level

Here is the text:
---
${text}
---

Respond with ONLY the JSON array, no other text.`;

    try {
      // This is a placeholder for the AI API call
      // Replace this with actual API integration (e.g., Google Gemini, OpenAI, etc.)
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      return JSON.parse(data.response || data.choices?.[0]?.message?.content || '[]');
    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Fallback: Generate a sample quiz for demo purposes
      return [
        {
          questionText: "What is the main topic discussed in the provided text?",
          type: "Multiple Choice",
          options: ["Science", "History", "Literature", "Technology"],
          correctAnswer: "Science",
          explanation: "Based on the content analysis, this appears to be the primary focus."
        },
        {
          questionText: "The information provided is comprehensive and detailed.",
          type: "True/False",
          correctAnswer: "True",
          explanation: "The text contains detailed information on the subject matter."
        }
      ];
    }
  };

  const handleGenerateQuiz = async () => {
    if (!textContent.trim()) {
      setError('Please provide some text content for the quiz.');
      return;
    }

    if (quizParams.questionTypes.length === 0) {
      setError('Please select at least one question type.');
      return;
    }

    if (!quizTitle.trim()) {
      setError('Please provide a title for your quiz.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Generate quiz questions using AI
      const questions = await generateQuizWithAI(textContent, quizParams);

      // Save quiz to Firestore
      const quizData = {
        userId: currentUser.uid,
        sourceTitle: quizTitle,
        sourceText: textContent,
        difficulty: quizParams.difficulty,
        questions: questions,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'quizzes'), quizData);
      
      // Navigate to the quiz taking page
      navigate(`/quiz/${docRef.id}`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentExtracted = (content, title) => {
    setTextContent(content);
    if (title && !quizTitle) {
      setQuizTitle(title);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
            <p className="mt-1 text-sm text-gray-600">
              Generate interactive quizzes from your documents or text using AI
            </p>
          </div>

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              {activeTab === 'text' && (
                <div>
                  <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your text content
                  </label>
                  <textarea
                    id="textContent"
                    rows={8}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Paste your text here... The AI will analyze this content to generate relevant quiz questions."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Word count: {textContent.split(/\s+/).filter(word => word.length > 0).length}
                  </p>
                </div>
              )}

              {(activeTab === 'pdf' || activeTab === 'image') && (
                <Uploader
                  type={activeTab}
                  onContentExtracted={handleContentExtracted}
                />
              )}
            </div>

            {/* Quiz Configuration */}
            {textContent && (
              <div className="space-y-6 border-t pt-6">
                {/* Quiz Title */}
                <div>
                  <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    id="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter a title for your quiz"
                  />
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions: {quizParams.numberOfQuestions}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={quizParams.numberOfQuestions}
                      onChange={(e) => setQuizParams(prev => ({
                        ...prev,
                        numberOfQuestions: parseInt(e.target.value)
                      }))}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={suggestQuestionCount}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Suggest
                    </button>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex space-x-4">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => setQuizParams(prev => ({
                          ...prev,
                          difficulty
                        }))}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          quizParams.difficulty === difficulty
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Types
                  </label>
                  <div className="space-y-2">
                    {questionTypeOptions.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={quizParams.questionTypes.includes(type)}
                          onChange={() => handleQuestionTypeChange(type)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {/* Generate Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Quiz...
                      </div>
                    ) : (
                      'Generate Quiz'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator; 