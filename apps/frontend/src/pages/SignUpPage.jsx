import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, EnvelopeSimple, Lock, ArrowRight } from '@phosphor-icons/react';
import { signup } from '../api/authApi';

export default function SignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nickname: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ── 클라이언트 유효성 검사 ── */
  const validate = () => {
    const next = {};

    if (!form.nickname.trim()) {
      next.nickname = '닉네임을 입력해주세요.';
    } else if (form.nickname.trim().length < 2) {
      next.nickname = '닉네임은 2자 이상이어야 합니다.';
    }

    if (!form.email) {
      next.email = '이메일을 입력해주세요.';
    }

    if (!form.password) {
      next.password = '비밀번호를 입력해주세요.';
    } else if (form.password.length < 8) {
      next.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!form.passwordConfirm) {
      next.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (form.password !== form.passwordConfirm) {
      next.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await signup({
        nickname: form.nickname.trim(),
        email: form.email,
        password: form.password,
      });
      toast.success('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/signin');
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setErrors({ general: '이미 사용 중인 이메일입니다.' });
      } else {
        setErrors({ general: '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── 인풋 공통 스타일 ── */
  const inputClass = (fieldName) =>
    `h-11 w-full rounded-lg border bg-white pl-10 pr-4 text-[15px] text-gray-900 shadow-sm placeholder:text-gray-400 hover:border-gray-300 focus:outline-none focus:ring-[3px] transition-colors ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-gray-200 focus:border-primary focus:ring-primary/15'
    }`;

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
        className="flex flex-[0.9] items-center justify-center overflow-y-auto bg-[#fafafa] py-8"
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
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">회원가입</h2>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-8">
              {/* 닉네임 */}
              <div className="flex flex-col gap-2">
                <label htmlFor="nickname" className="text-sm font-medium text-gray-900">
                  닉네임
                </label>
                <div className="relative flex items-center">
                  <User size={18} className="pointer-events-none absolute left-3.5 text-gray-400" />
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    autoComplete="nickname"
                    placeholder="닉네임을 입력하세요"
                    value={form.nickname}
                    onChange={handleChange}
                    className={inputClass('nickname')}
                  />
                </div>
                {errors.nickname && <p className="text-xs text-red-500">{errors.nickname}</p>}
              </div>

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
                    placeholder="이메일을 입력하세요"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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
                    autoComplete="new-password"
                    placeholder="8자 이상 입력하세요"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-2">
                <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-900">
                  비밀번호 확인
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="pointer-events-none absolute left-3.5 text-gray-400" />
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    className={inputClass('passwordConfirm')}
                  />
                </div>
                {errors.passwordConfirm && (
                  <p className="text-xs text-red-500">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* 일반 에러 메시지 */}
              {errors.general && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {errors.general}
                </p>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  '처리 중...'
                ) : (
                  <>
                    가입하기
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* 카드 푸터 */}
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?
              <Link
                to="/signin"
                className="ml-1 font-medium text-gray-900 transition-colors hover:text-primary"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
