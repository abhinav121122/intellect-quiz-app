import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase/config';
import QuizListItem from './QuizListItem';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('Loading quizzes for user:', currentUser.uid);
    
    const q = query(
      collection(db, 'quizzes'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        console.log('Firestore query successful, found:', querySnapshot.size, 'quizzes');
        const quizzesData = [];
        querySnapshot.forEach((doc) => {
          quizzesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setQuizzes(quizzesData);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore query error:', error);
        setError('Failed to load quizzes: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">If this takes too long, check the browser console for errors</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
            <h3 className="font-bold">Dashboard Error</h3>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to Intellect
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your documents into interactive quizzes with AI
          </p>
          
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Quiz
          </Link>
        </div>

        {/* Quizzes List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Quizzes
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {quizzes.length === 0 
                ? "You haven't created any quizzes yet. Click 'Create New Quiz' to get started!"
                : `You have ${quizzes.length} quiz${quizzes.length !== 1 ? 'es' : ''} ready to take.`
              }
            </p>
          </div>
          
          {quizzes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <QuizListItem key={quiz.id} quiz={quiz} />
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first quiz from a document or text.
              </p>
              <div className="mt-6">
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 