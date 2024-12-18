import React, { useState } from 'react';
import axios from 'axios';

const QuizGenerator = () => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(3);
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleGenerateQuiz = async () => {
        setLoading(true);
        setError(null);
        setSubmitted(false);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/generate-story', {
                prompt: topic,
                numQuestions: numQuestions
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setQuizData(response.data.data.questions);
        } catch (error) {
            setError('Error generating quiz data');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: answer
        }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Quiz Generator</h1>
                <div className="bg-gray-800 shadow-lg rounded-xl p-8 mb-12">
                    <div className="mb-6">
                        <label htmlFor="topic" className="block text-lg font-medium mb-2 text-purple-300">
                            Topic:
                        </label>
                        <input
                            type="text"
                            id="topic"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter your quiz topic"
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="numQuestions" className="block text-lg font-medium mb-2 text-purple-300">
                            Number of Questions:
                        </label>
                        <input
                            type="number"
                            id="numQuestions"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <button
                        onClick={handleGenerateQuiz}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            'Generate Quiz'
                        )}
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mb-8 text-lg">{error}</p>}
                {quizData.length > 0 && (
                    <div className="space-y-8">
                        {quizData.map((question, index) => (
                            <div key={index} className="bg-gray-800 shadow-lg rounded-xl p-6 transition duration-300 ease-in-out transform hover:scale-105">
                                <h3 className="text-2xl font-semibold mb-6 text-purple-300">Question {index + 1}</h3>
                                <p className="text-xl mb-6">{question.text}</p>
                                <ul className="space-y-4">
                                    {question.options.map((option, idx) => (
                                        <li key={idx}>
                                            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 ease-in-out">
                                                <input
                                                    type="radio"
                                                    id={`q${index}o${idx}`}
                                                    name={`q${index}`}
                                                    value={option}
                                                    checked={userAnswers[index] === option}
                                                    onChange={() => handleAnswerChange(index, option)}
                                                    className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                                />
                                                <span className="text-lg">{option}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <div className="mt-12 space-y-8">
                                <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Quiz Results</h2>
                                {quizData.map((question, index) => (
                                    <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                                        <h3 className="text-xl font-semibold mb-4 text-purple-300">Question {index + 1}</h3>
                                        <p className="text-lg mb-4">{question.text}</p>
                                        <p className="mb-2">Your answer: <span className="font-semibold">{userAnswers[index] || 'Not answered'}</span></p>
                                        <p className="mb-4">Correct answer: <span className="font-semibold">{question.correctAnswer}</span></p>
                                        {userAnswers[index] === question.correctAnswer ? (
                                            <p className="text-green-500 font-semibold text-lg">Correct! 🎉</p>
                                        ) : (
                                            <p className="text-red-500 font-semibold text-lg">Incorrect. Try again!</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizGenerator;