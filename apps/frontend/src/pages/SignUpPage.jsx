import { Link } from 'react-router-dom';
import { Notebook } from '@phosphor-icons/react';

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-screen">
      {/* 왼쪽 히어로 */}
      <div className="relative flex flex-[1.1] flex-col overflow-hidden border-r border-gray-800 bg-[#131315] p-12 text-white">
        <div className="z-10 mb-auto flex items-center gap-3 text-lg font-semibold tracking-tight">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Notebook size={14} weight="bold" />
          </div>
          Note2Quiz
        </div>

        <div className="z-10 mb-16 max-w-[520px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#1e1e22] px-3 py-1.5 text-[13px] font-medium text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#2D68FF]" />
            AI 퀴즈 생성 엔진 v2.0
          </div>
          <h1 className="mb-5 text-5xl font-bold leading-[1.2] tracking-tight">
            학습 노트를 붙여넣으면,
            <br />
            AI가 퀴즈를 만들어드립니다
          </h1>
          <p className="max-w-[90%] text-lg leading-relaxed text-gray-400">
            수업 내용을 복습하는 가장 빠른 방법. 긴 텍스트를 입력하고 즉시 퀴즈로 변환하여 학습
            효율을 극대화하세요.
          </p>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/5 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(45,104,255,0.08)_0%,transparent_70%)]" />
      </div>

      {/* 오른쪽 폼 영역 */}
      <div className="flex flex-[0.9] items-center justify-center bg-[#fafafa] bg-[linear-gradient(to_right,rgba(228,228,231,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,0.4)_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="w-full max-w-[440px] px-8">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-primary" />

            <div className="border-b border-gray-200 px-8 pb-6 pt-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">회원가입</h2>
            </div>

            <div className="px-8 py-8">
              <p className="text-sm text-gray-400">참고 시안: signup.html</p>
              <p className="mt-1 text-sm text-gray-400">이 페이지는 placeholder입니다.</p>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?
              <Link to="/signin" className="ml-1 font-medium text-gray-900 hover:text-primary">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
