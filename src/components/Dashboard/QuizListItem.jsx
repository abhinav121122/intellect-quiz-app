import { Link } from 'react-router-dom';

const QuizListItem = ({ quiz }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQuestionCount = () => {
    return quiz.questions?.length || 0;
  };

  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return 'Untitled Quiz';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <li>
      <Link
        to={`/quiz/${quiz.id}`}
        className="block hover:bg-gray-50 transition duration-200"
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {truncateTitle(quiz.sourceTitle)}
                </div>
                <div className="text-sm text-gray-500">
                  {getQuestionCount()} question{getQuestionCount() !== 1 ? 's' : ''} · {quiz.difficulty || 'Medium'} difficulty
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Created {formatDate(quiz.createdAt)}
              </div>
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default QuizListItem; 