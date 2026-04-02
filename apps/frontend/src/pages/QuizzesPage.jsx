import { useState, useEffect } from 'react';
import { MagnifyingGlass, CalendarBlank, ListNumbers } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getQuizSets } from '../api/quizApi';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0].replace(/-/g, '.');
};

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [quizSets, setQuizSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuizSets()
      .then((res) => setQuizSets(res.data))
      .catch((err) => console.error('퀴즈 목록 로딩 실패:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredQuizzes = quizSets.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const searchBar = (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <MagnifyingGlass
          size={18}
          className="text-gray-400 group-focus-within:text-primary transition-colors"
        />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="퀴즈 검색..."
        className="w-72 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
      />
    </div>
  );

  return (
    <div className="flex flex-1 flex-col h-full bg-[#F9FAFB]">
      <PageHeader title="Quizzes" rightSlot={searchBar} />

      {/* 퀴즈 카드 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="max-w-[1200px]">
          {isLoading ? (
            <div className="flex justify-center py-40 text-gray-400 font-medium">로딩 중...</div>
          ) : filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.quizSetId}
                  onClick={() => navigate(`/quizzes/${quiz.quizSetId}`)}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30 group h-[200px]"
                >
                  {/* 카드 태그 */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-blue-50 text-blue-600">
                      객관식
                    </span>
                  </div>

                  {/* 카드 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>

                  <div className="flex-1"></div>

                  {/* 카드 하단 정보 (날짜, 문제 수) */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100 mt-4">
                    <div className="flex items-center gap-1.5">
                      <CalendarBlank size={16} />
                      <span>{formatDate(quiz.createdAt)}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                      <ListNumbers size={16} />
                      <span>{quiz.questionCount}문제</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-400 text-sm">
                {searchQuery ? `"${searchQuery}"에 해당하는 퀴즈가 없습니다.` : '아직 생성된 퀴즈가 없습니다.'}
              </p>
            </div>
          )}

          {/* 더 보기 버튼 */}
          {/* {filteredQuizzes.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                더 보기
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
