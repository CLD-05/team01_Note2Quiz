import { PencilSimple } from '@phosphor-icons/react';

export default function NoteCreatePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-2xl bg-primary-light p-4">
        <PencilSimple size={32} className="text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-800">새 퀴즈 만들기</h3>
      <p className="text-sm text-slate-400">참고 시안: create.html</p>
      <p className="mt-1 text-sm text-slate-400">이 페이지는 placeholder입니다.</p>
    </div>
  );
}
