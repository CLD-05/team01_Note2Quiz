import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { getQuizSet } from '../api/quizApi';

export default function QuizPlayPage() {
  const navigate = useNavigate();
  const { quizSetId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const questionRefs = useRef([]);

  useEffect(() => {
    getQuizSet(quizSetId)
      .then((res) => {
        setQuizData(res.data);
      })
      .catch((err) => {
        console.error('퀴즈 로딩 실패:', err);
        setError('퀴즈를 불러오는 데 실패했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [quizSetId]);

  const totalQuestions = quizData?.quizzes?.length ?? 0;
  const answeredCount = Object.keys(userAnswers).length;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (answeredCount > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answeredCount]);

  const handleGoBack = () => {
    if (answeredCount > 0) {
      if (window.confirm('정말 나가시겠습니까? 작성 중인 답안이 모두 삭제됩니다.')) {
        navigate('/quizzes');
      }
    } else {
      navigate('/quizzes');
    }
  };

  const handleSelect = (questionId, optionIdx) => {
    setUserAnswers(prev => {
      if (prev[questionId] === optionIdx) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return { ...prev, [questionId]: optionIdx };
    });
  };

  const handleSubmit = () => {
    const unansweredIndex = quizData.quizzes.findIndex(q => userAnswers[q.id] === undefined);

    if (unansweredIndex !== -1) {
      alert(`${unansweredIndex + 1}번 문제를 아직 풀지 않았습니다.`);
      questionRefs.current[unansweredIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let correctCount = 0;
    const questionsResult = quizData.quizzes.map((q) => {
      // API answer는 1-indexed, userAnswers는 0-indexed
      const isCorrect = userAnswers[q.id] === q.answer - 1;
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        text: q.question,
        type: '객관식',
        isCorrect,
        options: q.options,
        answer: q.answer - 1,
        userAnswer: userAnswers[q.id],
        explanation: q.explanation,
      };
    });

    const finalResult = {
      title: quizData.title,
      date: new Date(quizData.createdAt).toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', ''),
      timeTaken: '방금 완료',
      totalQuestions,
      correctCount,
      questions: questionsResult,
    };

    navigate(`/quizzes/${quizSetId}/result`, { state: { resultData: finalResult } });
  };

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">퀴즈를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (error || !quizData) {
    return (
      <main className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-700 font-semibold mb-4">{error ?? '퀴즈를 찾을 수 없습니다.'}</p>
          <button onClick={() => navigate('/quizzes')} className="px-4 py-2 bg-primary text-white rounded-lg font-medium">
            목록으로
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full relative">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex-1">
          <button
            onClick={handleGoBack}
            className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <CaretLeft size={18} /> 목록으로
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">{quizData.title}</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {new Date(quizData.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>

        <div className="flex-1 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              answeredCount === totalQuestions
                ? 'bg-primary text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
          >
            전체 채점하기 ({answeredCount}/{totalQuestions})
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
          <span>총 {totalQuestions}문제</span>
          <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">객관식</span>
        </div>

        <div className="w-full max-w-3xl space-y-8 pb-12 mt-2">
          {quizData.quizzes.map((question, qIdx) => {
            const selectedIdx = userAnswers[question.id];

            return (
              <div
                key={question.id}
                ref={el => questionRefs.current[qIdx] = el}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-primary text-xs font-bold rounded-md">객관식</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
                    Q{qIdx + 1}. {question.question}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option, oIdx) => {
                      const isThisSelected = selectedIdx === oIdx;
                      let btnClass =
                        'w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between text-base font-medium ';

                      if (isThisSelected) {
                        btnClass +=
                          'border-2 border-primary bg-blue-50 text-primary font-semibold ring-1 ring-primary';
                      } else {
                        btnClass += 'border-slate-200 hover:bg-slate-50 text-slate-700';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(question.id, oIdx)}
                          className={btnClass}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{oIdx + 1}</span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
