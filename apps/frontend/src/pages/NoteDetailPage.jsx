import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { getNote, deleteNote } from '../api/noteApi';
import PageHeader from '../components/PageHeader';

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNote(noteId)
      .then(res => { setNote(res.data); setIsLoading(false); })
      .catch((error) => {
        console.error('상세 데이터 로딩 실패:', error);
        navigate('/notes');
      });
  }, [noteId, navigate]);

  const handleDelete = async () => {
    if (window.confirm('삭제하시겠습니까?')) {
      try {
        await deleteNote(noteId);
        navigate('/notes');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('노트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (isLoading || !note) return null;

  const leftSlot = (
    <button
      onClick={() => navigate('/notes')}
      className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
    >
      <ArrowLeft size={20} />
    </button>
  );

  const rightSlot = (
    <button
      onClick={() => navigate(`/quizzes/${noteId}`)}
      className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
    >
      <i className="ph-bold ph-play-circle text-lg"></i>
      퀴즈 풀러가기
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9FAFB]">
      <PageHeader leftSlot={leftSlot} title={note.title} rightSlot={rightSlot} />

      <div className="flex-1 overflow-y-auto">
        <article className="max-w-[800px] mx-auto px-10 py-12">
          <header className="mb-10">
            <div className="flex gap-4 text-xs text-gray-400">
              <span>{note.createdAt ? note.createdAt.split('T')[0] : '날짜 없음'}</span>
              <span>|</span>
              <span>{note.wordCount || 0}자</span>
              <span className="text-emerald-600 font-bold">{note.quizCount || 0}문제</span>
            </div>
          </header>

          <div className="text-lg text-gray-700 leading-[1.85] whitespace-pre-wrap mb-24">
            {note.content}
          </div>

          <footer className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleDelete}
              className="text-sm text-gray-400 hover:text-red-500 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <i className="ph ph-trash text-lg"></i>
              노트 삭제
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
