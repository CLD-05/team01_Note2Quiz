import { NavLink } from 'react-router-dom';
import { Notebook, ListChecks, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sidebar-hover text-primary'
        : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
    }`;

  return (
    <aside className="flex w-60 flex-col bg-sidebar text-white">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="text-lg font-bold text-primary">Note2Quiz</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <NavLink to="/notes" className={linkClass}>
          <Notebook size={20} />
          Notes
        </NavLink>
        <NavLink to="/quizzes" className={linkClass}>
          <ListChecks size={20} />
          Quizzes
        </NavLink>
      </nav>

      <div className="border-t border-slate-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{user?.nickname}</span>
          <button
            onClick={logout}
            className="rounded p-1 text-slate-400 transition-colors hover:text-white"
          >
            <SignOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
