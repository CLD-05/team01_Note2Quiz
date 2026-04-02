import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = 'http://localhost:3001/notes';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/${id}`)));
      setNotes(notes.filter(note => !selectedIds.includes(note.id)));
      setSelectedIds([]);
      setShowDeleteModal(false);
      setIsDeleteMode(false);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSelectedQuizzes = notes
    .filter(note => selectedIds.includes(note.id))
    .reduce((sum, note) => sum + (note.quizCount || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen relative">
      

      <div className="fixed top-1 right-0 h-16 px-10 flex items-center z-[110] pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          

          {!isDeleteMode && (
            <div className="relative group mr-1 animate-in fade-in zoom-in duration-200">
              <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors"></i>
              <input 
                type="text" 
                placeholder="제목 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-44 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          )}

          <button 
            onClick={() => { 
              setIsDeleteMode(!isDeleteMode); 
              setSelectedIds([]); 
              if(isDeleteMode) setSearchTerm(''); // 삭제 모드 취소 시 검색어 초기화(선택사항)
            }}
            className={`h-9 px-3 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm ${
              isDeleteMode ? 'bg-red-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:text-red-600'
            }`}
          >
            <i className={isDeleteMode ? "ph ph-x text-lg" : "ph ph-trash text-lg"}></i>

            {isDeleteMode ? '삭제 취소' : '노트 삭제하기'}
          </button>

          {!isDeleteMode && (
            <button 
              onClick={() => navigate('/notes/new')} 
              className="h-9 bg-primary text-white px-4 rounded-lg text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md"
            >
              <i className="ph-bold ph-plus"></i>새 노트 추가
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 px-10 py-10">
        <div className="max-w-[1400px] mx-auto">
          
          {isDeleteMode && (
            <div className="flex items-center justify-between mb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">{selectedIds.length}개 선택됨</span>
              </div>
              <button 
                onClick={() => selectedIds.length > 0 && setShowDeleteModal(true)}
                disabled={selectedIds.length === 0}
                className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${selectedIds.length > 0 ? 'text-red-600 hover:text-red-700' : 'text-gray-300'}`}
              >
                <i className="ph ph-trash text-lg"></i>선택 삭제
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-40 font-medium text-gray-400">데이터 로딩 중...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note) => {
                const isSelected = selectedIds.includes(note.id);
                return (
                  <div 
                    key={note.id} 
                    onClick={(e) => isDeleteMode ? toggleSelect(e, note.id) : navigate(`/notes/${note.id}`)}
                    className={`bg-white rounded-xl border p-5 flex flex-col transition-all relative ${
                      isDeleteMode && isSelected ? 'border-primary shadow-md bg-blue-50/5' : 'border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-lg group'
                    }`}
                  >
                    {isDeleteMode && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                          {isSelected && <i className="ph-bold ph-check text-white text-[10px]"></i>}
                        </div>
                      </div>
                    )}

                    <div className={isDeleteMode ? "pl-8" : ""}>
                      <h3 className={`text-base font-bold mb-2 pr-2 line-clamp-1 leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                        {note.title}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {note.wordCount?.toLocaleString() || 0}자
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {note.quizCount || 0}문제
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                        {note.preview}
                      </p>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <div className="flex items-center gap-1">
                          <i className="ph ph-calendar-blank text-xs"></i>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        {!isDeleteMode && <i className="ph ph-caret-right text-gray-200 group-hover:text-primary transition-colors"></i>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>


      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <i className="ph-fill ph-warning text-2xl text-red-500"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900">노트 삭제 확인</h3>
              </div>
              <p className="text-gray-600 mb-3 leading-relaxed">
                선택한 <strong className="text-gray-900">{selectedIds.length}개의 노트</strong>를 삭제하시겠습니까?
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <i className="ph-fill ph-info text-red-500 mt-0.5"></i>
                  <p className="text-sm text-red-700 leading-relaxed font-medium">
                    노트를 삭제하면 해당 노트와 연결된 모든 퀴즈<strong className="text-red-800">(총 {totalSelectedQuizzes}개의 문제)</strong>도 함께 삭제됩니다. 이 작업은 취소할 수 없습니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200">취소</button>
                <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600">삭제하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}