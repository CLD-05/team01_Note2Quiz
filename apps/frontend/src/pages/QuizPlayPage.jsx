import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Robot } from '@phosphor-icons/react';

const mockData = {
  title: "Docker 컨테이너 기초",
  date: "2026.03.28",
  questions: [
    {
      id: 1,
      text: "다음 중 Docker 컨테이너의 특징으로 올바른 것은?",
      options: ["가상 머신보다 무겁다", "호스트 OS 커널을 공유한다", "하드웨어 가상화가 필요하다", "항상 GUI 환경을 제공한다"],
      answer: 1,
      explanation: "Docker 컨테이너는 호스트 OS의 커널을 공유하여 가상 머신보다 가볍고 빠르게 실행됩니다."
    },
    {
      id: 2,
      text: "Docker 컨테이너와 가상 머신의 차이점으로 올바른 것은?",
      options: ["둘 다 하이퍼바이저가 필요하다", "컨테이너는 게스트 OS를 포함한다", "컨테이너는 더 가볍고 빠르게 시작한다", "가상 머신이 컨테이너보다 리소스 효율이 높다"],
      answer: 2,
      explanation: "Docker 컨테이너는 하이퍼바이저 없이 호스트 OS의 커널을 공유하므로 훨씬 가볍고 시작 속도가 빠릅니다."
    },
    {
      id: 3,
      text: "Docker 이미지와 컨테이너의 관계로 올바른 것은?",
      options: ["이미지는 실행 중인 컨테이너를 의미한다", "컨테이너는 이미지를 기반으로 생성된 실행 환경이다", "하나의 이미지로 하나의 컨테이너만 생성 가능하다", "컨테이너를 삭제하면 이미지도 함께 삭제된다"],
      answer: 1,
      explanation: "이미지는 애플리케이션 실행에 필요한 파일과 설정값을 포함한 정적인 템플릿이며, 컨테이너는 이를 실행한 상태입니다."
    }
  ]
};

export default function QuizPlayPage() {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState({}); 
  
  // 💡 2번 기능(스크롤)을 위한 Refs 배열
  const questionRefs = useRef([]);

  const totalQuestions = mockData.questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  // 💡 1번 기능: 브라우저 새로고침/닫기 방지 (useEffect)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (answeredCount > 0) {
        e.preventDefault();
        e.returnValue = ''; // 크롬 등 대부분의 브라우저에서 경고창을 띄우기 위한 표준 설정
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answeredCount]);

  // 💡 1번 기능: 내부 '목록으로' 버튼 클릭 시 경고
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
    // 💡 2번 기능: 안 푼 문제 찾아서 스크롤하기
    const unansweredIndex = mockData.questions.findIndex(q => userAnswers[q.id] === undefined);
    
    if (unansweredIndex !== -1) {
      alert(`${unansweredIndex + 1}번 문제를 아직 풀지 않았습니다.`);
      // 해당 문제 카드로 부드럽게 스크롤 이동
      questionRefs.current[unansweredIndex].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }

    // 모든 문제를 다 풀었을 때만 채점 및 이동 진행
    let correctCount = 0;
    const questionsResult = mockData.questions.map((q) => {
      const isCorrect = userAnswers[q.id] === q.answer;
      if (isCorrect) correctCount++;
      return {
        id: q.id,
        text: q.text,
        type: "객관식",
        isCorrect: isCorrect,
        options: q.options,
        answer: q.answer,
        userAnswer: userAnswers[q.id],
        explanation: q.explanation
      };
    });

    const finalResult = {
      title: mockData.title,
      date: mockData.date,
      timeTaken: "방금 완료",
      totalQuestions: totalQuestions,
      correctCount: correctCount,
      questions: questionsResult
    };

    navigate(`/quizzes/1/result`, { state: { resultData: finalResult } }); 
  };

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
          <h1 className="text-xl font-bold text-slate-900">{mockData.title}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{mockData.date}</p>
        </div>

        <div className="flex-1 flex justify-end gap-2">
          {/* 💡 버튼을 항상 활성화하거나, 시각적으로만 유도하도록 유지 */}
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
          {mockData.questions.map((question, qIdx) => {
            const selectedIdx = userAnswers[question.id];
            
            return (
              <div 
                key={question.id} 
                // 💡 Ref 연결
                ref={el => questionRefs.current[qIdx] = el}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-primary text-xs font-bold rounded-md">객관식</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
                    Q{qIdx + 1}. {question.text}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {question.options.map((option, oIdx) => {
                      const isThisSelected = selectedIdx === oIdx;
                      let btnClass = "w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between text-base font-medium ";
                      
                      if (isThisSelected) {
                        btnClass += "border-2 border-primary bg-blue-50 text-primary font-semibold ring-1 ring-primary";
                      } else {
                        btnClass += "border-slate-200 hover:bg-slate-50 text-slate-700";
                      }

                      return (
                        <button key={oIdx} onClick={() => handleSelect(question.id, oIdx)} className={btnClass}>
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

      {/* <button className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform group z-50">
        <Robot size={28} weight="fill" className="text-white" />
        <div className="absolute right-16 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          AI에게 도움 요청하기
        </div>
      </button> */}
    </main>
  );
}