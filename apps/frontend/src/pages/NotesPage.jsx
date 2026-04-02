import { Notebook } from '@phosphor-icons/react';
import PageHeader from '../components/PageHeader';

export default function NotesPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <PageHeader title="Notes" />
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-2xl bg-primary-light p-4">
          <Notebook size={32} className="text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800">노트 목록</h3>
        <p className="text-sm text-slate-400">참고 시안: notes.html</p>
        <p className="mt-1 text-sm text-slate-400">이 페이지는 placeholder입니다.</p>
      </div>
    </div>
  );
}
