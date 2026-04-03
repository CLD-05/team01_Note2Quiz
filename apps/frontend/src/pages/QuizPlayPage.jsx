import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CaretLeft, BookOpen, X } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import { getQuizSet } from '../api/quizApi';

export default function QuizPlayPage() {
  const navigate = useNavigate();
  const { quizSetId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [openHints, setOpenHints] = useState(new Set());
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    getQuizSet(quizSetId)
      .then((res) => setQuizData(res.data))
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

  // 패널 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isNoteOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isNoteOpen]);

  const handleGoBack = () => {
    if (answeredCount > 0) {
      if (window.confirm('정말 나가시겠습니까? 작성 중인 답안이 모두 삭제됩니다.')) {
        navigate('/quizzes');
      }
    } else {
      navigate('/quizzes');
    }
  };

  const toggleHint = (questionId) => {
    setOpenHints((prev) => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  };

  const handleSelect = (questionId, optionIdx) => {
    setUserAnswers((prev) => {
      if (prev[questionId] === optionIdx) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return { ...prev, [questionId]: optionIdx };
    });
  };

  const handleSubmit = () => {
    const unansweredIndex = quizData.quizzes.findIndex((q) => userAnswers[q.id] === undefined);

    if (unansweredIndex !== -1) {
      alert(`${unansweredIndex + 1}번 문제를 아직 풀지 않았습니다.`);
      questionRefs.current[unansweredIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let correctCount = 0;
    const questionsResult = quizData.quizzes.map((q) => {
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
      date: new Date(quizData.createdAt).toLocaleDateString('ko-KR'),
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
          <button
            onClick={() => navigate('/quizzes')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            목록으로
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full relative">
      {/* 헤더 */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex-1">
          <button
            onClick={handleGoBack}
            className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
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

        <div className="flex-1 flex justify-end items-center gap-3">
          {/* 학습 노트 보기 버튼 */}
          {quizData.noteContent && (
            <button
              onClick={() => setIsNoteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <BookOpen size={17} />
              학습 노트
            </button>
          )}
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              answeredCount === totalQuestions
                ? 'bg-primary text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
            }`}
          >
            전체 채점하기 ({answeredCount}/{totalQuestions})
          </button>
        </div>
      </header>

      {/* 퀴즈 콘텐츠 */}
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
                ref={(el) => (questionRefs.current[qIdx] = el)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-primary text-xs font-bold rounded-md">
                      객관식
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
                    Q{qIdx + 1}. {question.question}
                  </h2>

                  {question.tip && (
                    <div className="mb-6 flex flex-col items-start">
                      <button
                        onClick={() => toggleHint(question.id)}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer focus:outline-none ${
                          openHints.has(question.id)
                            ? 'bg-slate-50 border-slate-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className={`transition-colors ${openHints.has(question.id) ? 'text-amber-500' : 'text-slate-500 group-hover:text-amber-500'}`}
                        >
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
                        </svg>
                        <span className="text-[14px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                          {openHints.has(question.id) ? '힌트 닫기' : '힌트 보기'}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className={`text-slate-400 transition-transform duration-300 ml-1 ${openHints.has(question.id) ? 'rotate-180' : ''}`}
                        >
                          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
                        </svg>
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-in-out w-full ${
                          openHints.has(question.id)
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="mt-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex gap-3">
                            <div className="mt-0.5 text-amber-500 shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                              >
                                <path d="M240,128a112,112,0,1,1-112-112A112.12,112.12,0,0,1,240,128Zm-112-72a16,16,0,1,0,16,16A16,16,0,0,0,128,56Zm24,112H136V120a8,8,0,0,0-8-8H112a8,8,0,0,0,0,16h8v40H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-amber-900 mb-1">Tip</h4>
                              <p className="text-[15px] leading-relaxed text-amber-800/80 break-keep">
                                {question.tip}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option, oIdx) => {
                      const isThisSelected = selectedIdx === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(question.id, oIdx)}
                          className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center text-base font-medium cursor-pointer ${
                            isThisSelected
                              ? 'border-2 border-primary bg-blue-50 text-primary font-semibold ring-1 ring-primary'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="mr-3">{oIdx + 1}</span>
                          <span>{option}</span>
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

      {/* 백드롭 */}
      <div
        onClick={() => setIsNoteOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-20 transition-opacity duration-300 ${
          isNoteOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 학습 노트 슬라이딩 패널 */}
      <div
        className={`fixed inset-y-0 right-0 w-[62%] min-w-[480px] bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${
          isNoteOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 패널 헤더 */}
        <div className="h-16 px-8 flex items-center justify-between border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500">
              <BookOpen size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">학습 노트</h2>
          </div>
          <button
            onClick={() => setIsNoteOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
            닫기
          </button>
        </div>

        {/* 패널 콘텐츠 */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div
            className="prose prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-[15px]
            prose-li:text-slate-700 prose-li:text-[15px]
            prose-strong:text-slate-900
            prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-slate-800
            prose-pre:bg-slate-900 prose-pre:text-slate-100
            prose-blockquote:border-l-primary prose-blockquote:text-slate-600
            prose-a:text-primary
          "
          >
            <ReactMarkdown>{quizData.noteContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
