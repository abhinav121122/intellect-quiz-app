const Results = ({ quiz, answers, onRetake, onBackToDashboard }) => {
  const correctAnswers = answers.filter(answer => answer?.isCorrect).length;
  const totalQuestions = answers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good effort! 👍';
    if (percentage >= 60) return 'Not bad, but you can do better! 📚';
    return 'Keep studying and try again! 💪';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Summary */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
              <h2 className="text-xl text-gray-600">{quiz.sourceTitle}</h2>
            </div>

            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(scorePercentage)}`}>
                {scorePercentage}%
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {correctAnswers} out of {totalQuestions} correct
              </div>
              <div className="text-lg font-medium text-gray-800">
                {getScoreMessage(scorePercentage)}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onRetake}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBackToDashboard}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detailed Results</h3>
            <p className="text-sm text-gray-600">Review your answers and explanations</p>
          </div>

          <div className="divide-y divide-gray-200">
            {answers.map((answer, index) => (
              <div key={index} className="px-6 py-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Question {index + 1}
                    </h4>
                    <p className="text-gray-700 mb-4">{answer?.questionText}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {answer?.isCorrect ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Your Answer:</p>
                    <p className={`text-sm ${answer?.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {answer?.userAnswer || 'No answer provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Correct Answer:</p>
                    <p className="text-sm text-green-700">{answer?.correctAnswer}</p>
                  </div>
                </div>

                {answer?.explanation && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Explanation:</p>
                    <p className="text-sm text-gray-600">{answer.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results; 