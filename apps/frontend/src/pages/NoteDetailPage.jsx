import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/notes/${noteId}`)
      .then(res => { setNote(res.data); setIsLoading(false); })
      .catch(() => navigate('/notes'));
  }, [noteId, navigate]);

  if (isLoading || !note) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9FAFB] relative">
      

      <div className="fixed top-0 left-0 right-0 h-16 z-[110] pointer-events-none lg:left-64">
        <div className="flex items-center justify-between h-full px-10 pointer-events-auto mt-1">

          <button 
            onClick={() => navigate('/notes')} 
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 -ml-8 mt-1"
          >
            <i className="ph ph-arrow-left text-xl"></i>
          </button>

          <button 
            onClick={() => navigate(`/quizzes/${noteId}`)}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 shadow-md active:scale-95"
          >
            <i className="ph-bold ph-play-circle text-lg mr-2"></i>
            퀴즈 풀러가기
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <article className="max-w-[800px] mx-auto px-10 py-16">
          <header className="mb-12">
            <div className="flex gap-4 text-xs text-gray-400 mb-6">
              <span>{note.createdAt.split('T')[0]}</span>
              <span>|</span>
              <span>{note.wordCount}자</span>
              <span className="text-emerald-600 font-bold">{note.quizCount}문제</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{note.title}</h2>
          </header>

          <div className="text-lg text-gray-700 leading-[1.85] whitespace-pre-wrap mb-24">
            {note.content}
          </div>

          <footer className="pt-8 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => { if(window.confirm("삭제하시겠습니까?")) axios.delete(`http://localhost:3001/notes/${noteId}`).then(() => navigate('/notes')) }}
              className="text-sm text-gray-400 hover:text-red-500 font-semibold flex items-center gap-1.5"
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