import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EnvelopeSimple, Lock, ArrowRight } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

/* ───────────────────────────── 히어로 일러스트 ───────────────────────────── */
function HeroIllustration() {
  return (
    <div className="relative flex h-[280px] items-center">
      {/* 노트 카드 */}
      <div
        className="relative h-[220px] w-[180px] rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        style={{
          transform: 'perspective(1000px) rotateY(15deg) translateZ(-20px)',
          boxShadow: '20px 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="mb-5 h-3 w-2/5 rounded bg-white/20" />
        <div className="mb-2.5 h-2 w-[90%] rounded bg-white/10" />
        <div className="mb-2.5 h-2 w-[80%] rounded bg-white/10" />
        <div className="mb-2.5 h-2 w-[95%] rounded bg-white/10" />
        <div className="h-2 w-3/5 rounded bg-white/10" />
      </div>

      {/* AI 노드 */}
      <div className="relative mx-8 flex flex-col items-center">
        {/* 연결선 */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: '-90px',
            right: '-90px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(45,104,255,0.5), transparent)',
            zIndex: 0,
          }}
        />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-[#131315] shadow-[0_0_20px_rgba(45,104,255,0.15)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2D68FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
      </div>

      {/* 퀴즈 카드 스택 */}
      <div
        className="relative h-[160px] w-[200px]"
        style={{ transform: 'perspective(1000px) rotateY(-10deg) translateZ(20px)' }}
      >
        <div className="absolute inset-0 translate-x-[15px] translate-y-[15px] rotate-[4deg] rounded-xl border border-gray-200 bg-white opacity-80 shadow-lg" />
        <div className="absolute inset-0 translate-x-[5px] translate-y-[5px] rotate-[2deg] rounded-xl border border-gray-200 bg-white opacity-90 shadow-lg" />
        <div className="absolute inset-0 flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-primary">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Concept Review</span>
          </div>
          <p className="rounded border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
            Q. Explain the primary difference between...
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── 메인 컴포넌트 ─────────────────────────────── */
export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email: form.email, password: form.password });
      toast.success('로그인되었습니다!');
      navigate('/notes');
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        console.log(err);
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* ── 왼쪽 히어로 ── */}
      <div className="relative flex flex-[1.1] flex-col overflow-hidden border-r border-gray-800 bg-[#131315] p-12 text-white">
        {/* 배경 그라데이션 */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '20%',
            left: '50%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(45,104,255,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* 로고 */}
        <div className="z-10 mb-auto flex items-center gap-3 text-lg font-semibold tracking-tight">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          Note2Quiz
        </div>

        {/* 일러스트 */}
        <div className="z-10 mb-auto">
          <HeroIllustration />
        </div>

        {/* 히어로 텍스트 */}
        <div className="z-10 mb-8 max-w-[520px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-[#1e1e22] px-3 py-1.5 text-[13px] font-medium text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#2D68FF]" />
            AI 퀴즈 생성 엔진 v2.0
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-[1.2] tracking-tight">
            학습 노트를 붙여넣으면,
            <br />
            AI가 퀴즈를 만들어드립니다
          </h1>
          <p className="text-base leading-relaxed text-gray-400">
            수업 내용을 복습하는 가장 빠른 방법. 긴 텍스트를 입력하고 즉시 퀴즈로 변환하여 학습
            효율을 극대화하세요.
          </p>
        </div>
      </div>

      {/* ── 오른쪽 폼 ── */}
      <div
        className="flex flex-[0.9] items-center justify-center bg-[#fafafa]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(228,228,231,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(228,228,231,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="w-full max-w-[440px] px-8">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            {/* 상단 파란 라인 */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-primary" />

            {/* 카드 헤더 */}
            <div className="border-b border-gray-200 px-8 pb-6 pt-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">로그인</h2>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-8">
              {/* 이메일 */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  이메일
                </label>
                <div className="relative flex items-center">
                  <EnvelopeSimple
                    size={18}
                    className="pointer-events-none absolute left-3.5 text-gray-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-[15px] text-gray-900 shadow-sm placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  비밀번호
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="pointer-events-none absolute left-3.5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-[15px] text-gray-900 shadow-sm placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  '로그인 중...'
                ) : (
                  <>
                    로그인
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* 카드 푸터 */}
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 text-center text-sm text-gray-500">
              계정이 없으신가요?
              <Link
                to="/signup"
                className="ml-1 font-medium text-gray-900 transition-colors hover:text-primary"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
