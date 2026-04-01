import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
  '/notes': 'Notes',
  '/notes/new': 'Create',
  '/quizzes': 'Quizzes',
};

export default function Layout() {
  const { pathname } = useLocation();

  const title =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith('/notes/') ? 'Note Detail' : null) ||
    (pathname.startsWith('/quizzes/') ? 'Quiz' : null) ||
    '';

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-900">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* 헤더 */}
        <header className="z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-10 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
          {/* 각 페이지에서 필요한 액션 버튼은 페이지 내부에서 구현 */}
        </header>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
