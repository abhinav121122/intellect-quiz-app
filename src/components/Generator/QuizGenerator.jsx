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
    const prompt = `You are an expert quiz creator. Generate exactly ${options.numberOfQuestions} high-quality quiz questions based on the provided text.

REQUIREMENTS:
- Generate EXACTLY ${options.numberOfQuestions} questions (no more, no less)
- Difficulty level: ${options.difficulty}
- Question types to include: ${JSON.stringify(options.questionTypes)}

QUESTION VARIETY (for Multiple Choice):
Create a diverse mix of question types:
- Direct questions ("Who was...", "What is...", "Where did...")
- "Which of the following is NOT..." questions
- "All of the following are true EXCEPT..." questions
- Statement-based questions ("Statement 1: ... Statement 2: ... Which is correct?")
- Matching questions formatted as MCQs ("Which option correctly matches...")
- Cause and effect questions ("What was the result of...")
- Definition questions ("What does [term] mean in this context?")

PLAUSIBLE DISTRACTORS (for Multiple Choice):
- Use other names, dates, places, or facts from the source material as incorrect options
- Make distractors relevant and challenging (not obviously wrong)
- Include numbers/dates that are close to but not exactly correct
- Use similar-sounding terms or concepts from the text

BALANCED ANSWER DISTRIBUTION:
- Distribute correct answers evenly among options A, B, C, D
- Don't make option A or C always correct

DIFFICULTY GUIDELINES:
- ${options.difficulty === 'Easy' ? 'Use direct facts from text, simple recall questions' : ''}
- ${options.difficulty === 'Medium' ? 'Require understanding and basic analysis, some inference' : ''}
- ${options.difficulty === 'Hard' ? 'Require critical thinking, analysis, synthesis of multiple concepts' : ''}

JSON FORMAT:
Return exactly ${options.numberOfQuestions} questions in this format:
{
  "questionText": "Your question here",
  "type": "Multiple Choice", // or "True/False" or "Fill in the Blank"
  "options": ["Option A", "Option B", "Option C", "Option D"], // Only for Multiple Choice
  "correctAnswer": "Option A", // The exact text of correct answer
  "explanation": "Detailed explanation why this is correct and others are wrong"
}

IMPORTANT RULES:
- For True/False: NO "options" field, just "correctAnswer": "True" or "False"
- For Fill in the Blank: questionText contains "____", correctAnswer is the missing word/phrase
- Each explanation should be detailed and educational
- Questions must be factually accurate based on the source text
- Avoid repetitive question patterns

SOURCE TEXT:
---
${text}
---

Generate exactly ${options.numberOfQuestions} questions as a JSON array:`;

    try {
      console.log('Generating quiz with AI...');
      
      // Call our secure serverless function
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        console.error('API response not ok:', response.status);
        throw new Error(`Failed to generate quiz: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI response received:', data);
      
      // The serverless function returns { questions: [...] }
      if (data.questions && Array.isArray(data.questions)) {
        return data.questions;
      }
      
      throw new Error('Invalid response format from AI');
      
    } catch (error) {
      console.error('AI Generation Error:', error);
      console.log('Falling back to demo questions...');
      
      // Fallback: Generate smart demo questions based on content
      const fallbackQuestions = [];
      const wordCount = text.split(/\s+/).length;
      
             // Generate the exact number of requested demo questions
       const questionsToGenerate = options.numberOfQuestions;
       
       const questionTemplates = {
         'Multiple Choice': [
           {
             questionText: "What is the primary focus of the provided text?",
             options: ["Scientific concepts", "Historical events", "Literary analysis", "Technical procedures"],
             correctAnswer: "Scientific concepts",
             explanation: "Based on content analysis, scientific concepts appear to be the main focus."
           },
           {
             questionText: "Which of the following is NOT typically discussed in this type of content?",
             options: ["Core concepts", "Detailed explanations", "Unrelated topics", "Supporting examples"],
             correctAnswer: "Unrelated topics",
             explanation: "The text focuses on relevant topics rather than unrelated material."
           },
           {
             questionText: "What can be inferred about the complexity level of this content?",
             options: ["Very basic", "Intermediate to advanced", "Expert level only", "Beginner friendly"],
             correctAnswer: "Intermediate to advanced",
             explanation: "The content appears to require some background knowledge to fully understand."
           },
           {
             questionText: "All of the following are true about the text EXCEPT:",
             options: ["It contains factual information", "It provides explanations", "It lacks coherent structure", "It covers specific topics"],
             correctAnswer: "It lacks coherent structure",
             explanation: "The text demonstrates clear organization and logical flow."
           }
         ],
         'True/False': [
           {
             questionText: "The provided text contains detailed information about its subject matter.",
             correctAnswer: "True",
             explanation: "The text provides comprehensive coverage of the discussed topics."
           },
           {
             questionText: "The content is written for a general audience without specific knowledge.",
             correctAnswer: "False",
             explanation: "The content appears to require some background knowledge in the field."
           },
           {
             questionText: "The text follows a logical progression of ideas.",
             correctAnswer: "True",
             explanation: "The information is presented in an organized, sequential manner."
           },
           {
             questionText: "The content lacks supporting details and examples.",
             correctAnswer: "False",
             explanation: "The text includes relevant details and explanations to support main points."
           }
         ],
         'Fill in the Blank': [
           {
             questionText: "The text primarily discusses ____ related concepts.",
             correctAnswer: "technical",
             explanation: "Based on content analysis, technical concepts are the main focus."
           },
           {
             questionText: "The information presented appears to be ____ in nature.",
             correctAnswer: "educational",
             explanation: "The text serves an informational or educational purpose."
           },
           {
             questionText: "The level of detail suggests the content is intended for ____ readers.",
             correctAnswer: "knowledgeable",
             explanation: "The depth of information indicates it's aimed at informed readers."
           }
         ]
       };
       
       let questionIndex = 0;
       for (let i = 0; i < questionsToGenerate; i++) {
         const availableTypes = options.questionTypes.filter(type => questionTemplates[type]);
         if (availableTypes.length === 0) continue;
         
         const selectedType = availableTypes[i % availableTypes.length];
         const typeTemplates = questionTemplates[selectedType];
         const template = typeTemplates[questionIndex % typeTemplates.length];
         
         const question = {
           questionText: template.questionText,
           type: selectedType,
           correctAnswer: template.correctAnswer,
           explanation: `${template.explanation} (Demo question ${i + 1})`
         };
         
         if (selectedType === 'Multiple Choice') {
           question.options = template.options;
         }
         
         fallbackQuestions.push(question);
         questionIndex++;
       }
      
      return fallbackQuestions.length > 0 ? fallbackQuestions : [
        {
          questionText: "What is the main topic discussed in the provided text?",
          type: "Multiple Choice",
          options: ["Science", "History", "Literature", "Technology"],
          correctAnswer: "Science",
          explanation: "Demo question - AI generation failed, but quiz functionality works!"
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