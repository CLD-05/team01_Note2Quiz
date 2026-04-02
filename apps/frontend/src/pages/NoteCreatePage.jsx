import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NoteCreatePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LENGTH = 10000;
  
  // 1. 스프링 부트 퀴즈 생성 API 주소 (컨트롤러 설정에 따라 /api/quiz-sets 일 수도 있습니다)
  const API_URL = "http://localhost:8080/api/quizzes"; 

  const handleCreate = async () => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    const startTime = Date.now();  

    try {
      // 2. 가짜 서버에 보내던 복잡한 newNote 객체를 지우고, 백엔드가 요구하는 내용(content)만 전송합니다.
      const response = await axios.post(
        API_URL, 
        { content: content }, 
        { withCredentials: true }
      );

      const endTime = Date.now();
      const gap = endTime - startTime;
      const minWait = 3000; 

      if (gap < minWait) {
        await new Promise(resolve => setTimeout(resolve, minWait - gap));
      }

      const targetId = response.data.quizSetId || response.data.id; 

      if (targetId) {
        navigate(`/quizzes/${targetId}`);
      } else {
        navigate('/notes'); 
      }

    } catch (error) {
      console.error("생성 실패:", error);
      alert("노트 저장 및 퀴즈 생성에 실패했습니다. 백엔드 서버를 확인해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] relative">
      
      {/* 상단 고정 화살표 (위치 그대로 유지) */}
      <div className="fixed top-0 left-0 right-0 h-16 z-[120] pointer-events-none lg:left-[280px]">
        <div className="flex items-center h-full px-10 pointer-events-auto">
          <button 
            type="button"
            onClick={() => navigate('/notes')} 
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 -ml-16 mt-3 transition-all"
          >
            <i className="ph ph-arrow-left text-xl"></i>
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="max-w-[1200px] mx-auto space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-blue-50 rounded-lg text-[#2D68FF]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"></path>
                  <path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">새 퀴즈 만들기</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 transition-shadow hover:shadow-md relative overflow-hidden">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[350px] resize-none bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D68FF]/20 focus:border-[#2D68FF] transition-all text-base leading-relaxed" 
                placeholder="학습 노트를 여기에 붙여넣으세요..."
                disabled={isLoading}
              ></textarea>
              
              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mt-4 gap-4">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <i className="ph ph-info text-lg"></i>
                  텍스트 분량이 많을수록 더 정확한 퀴즈가 생성됩니다.
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                  <span className="text-sm font-medium text-slate-400 shrink-0">
                    {content.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}자
                  </span>
                  
                  <button 
                    type="button"
                    onClick={handleCreate}
                    disabled={!content.trim() || isLoading}
                    className="w-full sm:w-auto bg-[#2D68FF] hover:bg-[#2054DB] disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2D68FF]/20 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <i className="ph-bold ph-paper-plane-tilt text-lg"></i>
                    {isLoading ? '분석 중...' : '퀴즈 생성하기'}
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[4px] flex flex-col items-center justify-center z-50 animate-in fade-in duration-300">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-slate-900 font-bold text-xl mb-2 animate-pulse">AI가 노트를 분석하고 있습니다</p>
                  <p className="text-slate-500 text-sm font-medium">거의 다 되었습니다. 잠시만 기다려 주세요.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}