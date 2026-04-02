import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../api/noteApi';
import PageHeader from '../components/PageHeader';

export default function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. fetchNotes 수정
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteNote(id)));
      setNotes(notes.filter(note => !selectedIds.includes(note.id)));
      setSelectedIds([]);
      setShowDeleteModal(false);
      setIsDeleteMode(false);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  const filteredNotes = notes.filter(note => 
    note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSelectedQuizzes = notes
    .filter(note => selectedIds.includes(note.id))
    .reduce((sum, note) => sum + (note.quizCount || 0), 0);

  const rightSlot = (
    <div className="flex items-center gap-3">
      {!isDeleteMode && (
        <div className="relative group mr-1 animate-in fade-in zoom-in duration-200">
          <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-primary transition-colors"></i>
          <input
            type="text"
            placeholder="노트 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      )}
      <button
        onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedIds([]); if (isDeleteMode) setSearchTerm(''); }}
        className={`h-9 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
          isDeleteMode ? 'bg-red-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        <i className={isDeleteMode ? 'ph ph-x text-lg' : 'ph ph-trash text-lg'}></i>
        {isDeleteMode ? '삭제 취소' : '노트 삭제하기'}
      </button>
      {!isDeleteMode && (
        <button
          onClick={() => navigate('/notes/new')}
          className="h-9 bg-primary text-white px-4 rounded-lg text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <i className="ph-bold ph-plus text-base"></i>새 노트 추가
        </button>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB]">
      <PageHeader title="Notes" rightSlot={rightSlot} />

      <main className="flex-1 px-10 py-10 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          
          {isDeleteMode && (
            <div className="flex items-center justify-between mb-6 animate-in slide-in-from-top-2 duration-300 bg-white p-4 rounded-xl border border-red-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 font-bold">{selectedIds.length}개 선택됨</span>
              </div>
              <button 
                onClick={() => selectedIds.length > 0 && setShowDeleteModal(true)}
                disabled={selectedIds.length === 0}
                className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${selectedIds.length > 0 ? 'text-red-600 hover:text-red-700 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              >
                <i className="ph-fill ph-trash text-lg"></i>선택 삭제
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note) => {
                const isSelected = selectedIds.includes(note.id);
                return (
                  <div 
                    key={note.id} 
                    onClick={(e) => isDeleteMode ? toggleSelect(e, note.id) : navigate(`/notes/${note.id}`)}
                    className={`bg-white rounded-xl border p-5 flex flex-col transition-all relative min-h-[200px] ${
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
                      <h3 className={`text-lg font-bold mb-3 pr-2 line-clamp-2 leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                        {note.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                          {note.wordCount?.toLocaleString() || 0}자
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                          {note.quizCount || 0}문제
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed whitespace-pre-wrap">
                        {note.preview}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <i className="ph ph-calendar-blank text-sm"></i>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        {!isDeleteMode && <i className="ph-bold ph-arrow-right text-gray-200 group-hover:text-primary transition-colors"></i>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-400 text-sm">
                {searchTerm ? `"${searchTerm}"에 해당하는 노트가 없습니다.` : '아직 작성된 노트가 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <i className="ph-fill ph-warning text-2xl text-red-500"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900">노트 삭제 확인</h3>
              </div>
              <p className="text-gray-600 mb-4 text-base">
                선택한 <strong className="text-gray-900">{selectedIds.length}개의 노트</strong>를 삭제하시겠습니까?
              </p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-2.5">
                  <i className="ph-fill ph-info text-red-500 mt-0.5"></i>
                  <p className="text-sm text-red-700 leading-relaxed font-medium">
                    노트를 삭제하면 해당 노트와 연결된 모든 퀴즈<strong className="text-red-800">(총 {totalSelectedQuizzes}개의 문제)</strong>도 함께 삭제됩니다. 이 작업은 취소할 수 없습니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer">취소</button>
                <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20 cursor-pointer">삭제하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}