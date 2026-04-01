import { NavLink, useNavigate } from 'react-router-dom';
import {
  SquaresFour,
  Notebook,
  ClockCounterClockwise,
  GearSix,
  SignOut,
} from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/notes/new', label: 'Create', icon: SquaresFour },
  { to: '/notes', label: 'Notes', icon: Notebook },
  { to: '/quizzes', label: 'Quizzes', icon: ClockCounterClockwise },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
      isActive
        ? 'bg-sidebar-hover text-white'
        : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
    }`;

  const iconClass = ({ isActive }) => (isActive ? 'text-primary' : 'group-hover:text-slate-300');

  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-sidebar text-slate-300 shadow-xl">
      {/* 로고 */}
      <div className="flex h-20 shrink-0 items-center gap-3 px-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/30">
          <Notebook size={20} weight="bold" />
        </div>
        <span className="text-xl font-bold tracking-wide text-white">Note2Quiz</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/notes'} className={linkClass}>
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  className={`transition-colors ${isActive ? 'text-primary' : 'group-hover:text-slate-300'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 유저 프로필 */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
            {user?.nickname?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.nickname || '사용자'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded p-1 text-gray-400 transition-colors hover:text-white"
          >
            <SignOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
