import client from './client';

export const createQuizSet = (content) => client.post('/quiz-sets', { content });

export const getQuizSets = () => client.get('/quiz-sets');

export const getQuizSet = (quizSetId) => client.get(`/quiz-sets/${quizSetId}`);
