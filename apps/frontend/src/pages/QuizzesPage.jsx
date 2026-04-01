import { ListChecks } from '@phosphor-icons/react';

export default function QuizzesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-2xl bg-primary-light p-4">
        <ListChecks size={32} className="text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-800">퀴즈셋 목록</h3>
      <p className="text-sm text-slate-400">참고 시안: quizzes.html</p>
      <p className="mt-1 text-sm text-slate-400">이 페이지는 placeholder입니다.</p>
    </div>
  );
}
