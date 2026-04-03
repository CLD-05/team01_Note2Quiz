import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-900">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* 헤더와 콘텐츠 영역은 각 페이지에서 PageHeader 컴포넌트를 통해 구현 */}
        <Outlet />
      </main>
    </div>
  );
}
