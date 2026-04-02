import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { createQuizSet } from '../api/quizApi';
import PageHeader from '../components/PageHeader';

export default function NoteCreatePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LENGTH = 10000;

  const handleCreate = async () => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await createQuizSet(content);
      const { quizSetId } = response.data;

      navigate(`/quizzes/${quizSetId}`);
    } catch (error) {
      console.error('퀴즈 생성 실패:', error);
      alert('퀴즈 생성에 실패했습니다. 백엔드 서버를 확인해주세요.');
      setIsLoading(false);
    }
  };

  const backButton = (
    <button
      type="button"
      onClick={() => navigate('/notes')}
      className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
    >
      <ArrowLeft size={20} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      <PageHeader title="Create" />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="max-w-[1200px] mx-auto">
          <section>
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
                    className="w-full sm:w-auto bg-[#2D68FF] hover:bg-[#2054DB] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#2D68FF]/20 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
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
                  <p className="text-slate-900 font-bold text-xl mb-2 animate-pulse">
                    AI가 노트를 분석하고 있습니다
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    거의 다 되었습니다. 잠시만 기다려 주세요.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
