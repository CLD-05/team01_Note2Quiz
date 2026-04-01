import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, // 💡 Clock 아이콘 제거됨
  ArrowCounterClockwise, CaretRight, Check, X
} from '@phosphor-icons/react';

const mockResult = {
  title: "데이터를 불러오지 못했습니다",
  date: "0000.00.00",
  totalQuestions: 1,
  correctCount: 0,
  questions: []
};

export default function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const resultData = location.state?.resultData || mockResult;
  const [expandedIds, setExpandedIds] = useState({});

  const scorePercentage = Math.round((resultData.correctCount / resultData.totalQuestions) * 100);
  
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#F9FAFB] overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full px-8 py-10">
        
        {/* 상단 네비게이션 */}
        <button 
          onClick={() => navigate('/quizzes')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium mb-8"
        >
          <ArrowLeft size={16} />
          내 퀴즈 보관함으로 돌아가기
        </button>

        {/* 💡 수정된 부분: 타이틀 영역에서 '소요 시간' 블록을 완전히 제거했습니다 */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md tracking-wide">
                COMPLETED
              </span>
              <span className="text-slate-400 text-sm font-medium">{resultData.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">퀴즈 결과</h1>
            <p className="text-slate-500 font-medium">{resultData.title}</p>
          </div>
        </div>

        {/* 대시보드 요약 카드 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 mb-8 flex items-center gap-12">
          <div className="relative flex flex-col items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100" />
              <circle 
                cx="80" cy="80" r={radius} 
                stroke="currentColor" strokeWidth="16" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {resultData.correctCount}<span className="text-lg text-slate-400 font-semibold mx-0.5">/</span><span className="text-xl text-slate-400 font-semibold">{resultData.totalQuestions}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 tracking-widest">TOTAL SCORE</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-lg font-bold text-slate-900">정답률 {scorePercentage}%</h3>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${scorePercentage}%` }}></div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6 flex items-start gap-3">
              <span className="text-xl">🎉</span>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                {scorePercentage === 100 
                  ? "완벽해요! 모든 문제를 다 맞추셨습니다!" 
                  : `훌륭해요! ${resultData.totalQuestions - resultData.correctCount}문제만 다시 복습하면 완벽하겠어요!`}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowCounterClockwise size={18} /> 다시 풀기
              </button>
            </div>
          </div>
        </div>

        {/* 문제별 상세 결과 리스트 */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-bold text-slate-900">문제별 결과</h3>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                <CheckCircle size={14} weight="fill" /> 정답 {resultData.correctCount}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                <XCircle size={14} weight="fill" /> 오답 {resultData.totalQuestions - resultData.correctCount}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {resultData.questions.map((q, idx) => {
              const isExpanded = expandedIds[q.id]; 

              return (
                <div 
                  key={q.id} 
                  className={`flex flex-col bg-white rounded-xl border transition-colors ${
                    q.isCorrect ? 'border-slate-200' : 'border-red-200 border-l-4 border-l-red-500'
                  }`}
                >
                  <div 
                    onClick={() => toggleExpand(q.id)}
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-4 pr-4">
                      {q.isCorrect ? (
                        <CheckCircle size={24} weight="fill" className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <XCircle size={24} weight="fill" className="text-red-500 flex-shrink-0" />
                      )}
                      <p className="text-slate-800 font-medium text-sm leading-relaxed">
                        <span className="font-bold mr-1">Q{idx + 1}.</span> {q.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 pl-2">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded hidden sm:block">
                        {q.type}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                        상세 보기 
                        <CaretRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && q.options && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                      <div className="grid grid-cols-1 gap-2 mb-6">
                        {q.options.map((opt, oIdx) => {
                          const isCorrectAns = q.answer === oIdx;
                          const isUserAns = q.userAnswer === oIdx;

                          let btnClass = "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium flex items-center justify-between transition-colors ";
                          
                          if (isCorrectAns) {
                            btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                          } else if (isUserAns && !isCorrectAns) {
                            btnClass += "border-red-400 bg-red-50 text-red-700 opacity-80";
                          } else {
                            btnClass += "border-slate-200 bg-white text-slate-500 opacity-60";
                          }

                          return (
                            <div key={oIdx} className={btnClass}>
                              <div className="flex items-center">
                                <span className="mr-3">{oIdx + 1}.</span>
                                <span>{opt}</span>
                              </div>
                              {isCorrectAns && <Check size={18} weight="bold" className="text-emerald-500 flex-shrink-0" />}
                              {isUserAns && !isCorrectAns && <X size={18} weight="bold" className="text-red-500 flex-shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          <span className="font-bold text-emerald-600 mr-2">해설</span>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}