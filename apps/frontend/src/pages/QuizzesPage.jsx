import { useState } from 'react';
import { MagnifyingGlass, CalendarBlank, ListNumbers } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

// 퀴즈 목록 임시 데이터 (객관식만 남김)
const quizList = [
  {
    id: 1,
    title: 'Docker 컨테이너 기초',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.28',
    count: 10,
  },
  {
    id: 2,
    title: 'AWS EC2 인스턴스 관리',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.27',
    count: 15,
  },
  {
    id: 3,
    title: 'Linux 파일 시스템 구조',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.25',
    count: 8,
  },
  {
    id: 4,
    title: '네트워크 기초 - TCP/IP',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.24',
    count: 12,
  },
  {
    id: 5,
    title: 'Kubernetes Pod 개념',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.22',
    count: 10,
  },
  {
    id: 6,
    title: 'CI/CD 파이프라인 구축',
    tags: [{ label: '객관식', color: 'blue' }],
    date: '2026.03.20',
    count: 14,
  },
];

// 태그 색상을 결정하는 헬퍼 함수
const getTagStyle = (color) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600';
    case 'amber':
      return 'bg-amber-50 text-amber-600';
    case 'purple':
      return 'bg-purple-50 text-purple-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = quizList.filter((quiz) =>
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
          {filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => navigate(`/quizzes/${quiz.id}`)}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30 group h-[200px]"
                >
                  {/* 카드 태그 */}
                  <div className="flex items-center gap-2 mb-4">
                    {quiz.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${getTagStyle(tag.color)}`}
                      >
                        {tag.label}
                      </span>
                    ))}
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
                      <span>{quiz.date}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <div className="flex items-center gap-1.5">
                      <ListNumbers size={16} />
                      <span>{quiz.count}문제</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-slate-400 text-sm">"{searchQuery}"에 해당하는 퀴즈가 없습니다.</p>
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
