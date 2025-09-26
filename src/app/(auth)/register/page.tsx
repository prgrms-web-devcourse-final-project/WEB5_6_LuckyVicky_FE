'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import { signup } from '@/services/auth';
import { TERMS_CONTENT } from './terms';
import {
  isValidEmail,
  isValidPassword,
  onlyDigits,
  isValidPhoneKRParts,
} from '@/utils/validators';
import {
  checkDuplicateEmail,
  checkDuplicatePhone,
  checkDuplicateName,
} from '@/services/auth';

import Modal from '@/components/Modal';
import SignupButton from '@/components/register/SignupButton';
import CheckboxTrue from '@/assets/icon/checkbox_true.svg';
import CheckboxFalse from '@/assets/icon/checkbox_false.svg';

type AgreementItem = {
  id: 'age' | 'terms' | 'privacy-required' | 'privacy-optional';
  label: string;
  hasDetail?: boolean;
};

const AGREEMENT_ITEMS: ReadonlyArray<AgreementItem> = [
  { id: 'age', label: '본인은 만 14세 이상입니다.' },
  { id: 'terms', label: '이용약관에 동의합니다.', hasDetail: true },
  {
    id: 'privacy-required',
    label: '[필수] 개인정보 수집 및 이용에 동의합니다.',
    hasDetail: true,
  },
  {
    id: 'privacy-optional',
    label: '[선택] 개인정보 수집 및 이용에 동의합니다.',
    hasDetail: true,
  },
] as const;

type AgreementId = (typeof AGREEMENT_ITEMS)[number]['id'];

type ActiveModal = AgreementId | null;

function Page() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [agreements, setAgreements] = useState<Record<AgreementId, boolean>>(
    () =>
      AGREEMENT_ITEMS.reduce(
        (acc, { id }) => {
          acc[id] = false;
          return acc;
        },
        {} as Record<AgreementId, boolean>,
      ),
  );
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // 제거: 미사용 상태값 정리 (lint)

  // 이메일
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    setEmail(v);
    setEmailErr(
      v.length === 0
        ? null
        : isValidEmail(v)
          ? null
          : '올바른 이메일 형식이 아닙니다.',
    );
    setEmailChecked(false);
  };

  const handleCheckEmail = async () => {
    if (!isValidEmail(email)) {
      toast.error('올바른 이메일 형식이 아닙니다.');
      return;
    }
    try {
      const { data } = await checkDuplicateEmail(email);
      if (data?.isAvailable) {
        setEmailChecked(true);
        toast.success(data?.message ?? '사용 가능한 이메일입니다.');
      } else {
        setEmailChecked(false);
        toast.error(data?.message ?? '이미 사용 중인 이메일입니다.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '이메일 중복 확인 실패');
    }
  };

  // 비밀번호
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    setPassword(v);
    setPasswordErr(
      v.length === 0
        ? null
        : isValidPassword(v)
          ? null
          : '비밀번호는 영문 대소문자, 숫자, 특수문자 포함 8자 이상이어야 합니다.',
    );
  };

  const onPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? '';
    setPasswordConfirm(v);
    setPasswordConfirmErr(
      v.length === 0
        ? null
        : v === password
          ? null
          : '비밀번호가 일치하지 않습니다.',
    );
  };

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmErr, setPasswordConfirmErr] = useState<string | null>(
    null,
  );

  // 전화번호
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [phoneChecked, setPhoneChecked] = useState(false);

  const firstRef = useRef<HTMLInputElement>(null);
  const midRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  const updatePhoneErr = (np1: string, np2: string, np3: string) => {
    if (np1.length === 0 && np2.length === 0 && np3.length === 0) {
      setPhoneErr(null);
    } else if (isValidPhoneKRParts(np1, np2, np3)) {
      setPhoneErr(null);
    } else {
      setPhoneErr('올바른 전화번호 형식이 아닙니다.');
    }
  }

  const onChangeP1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 3);
    setP1(d);
    if (d.length === 3) midRef.current?.focus();
    updatePhoneErr(d, p2, p3);
    setPhoneChecked(false);
  };

  const onChangeP2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 4);
    setP2(d);
    if (d.length === 4) lastRef.current?.focus();
    updatePhoneErr(p1, d, p3);
    setPhoneChecked(false);
  };

  const onChangeP3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 4);
    setP3(d);
    updatePhoneErr(p1, p2, d);
    setPhoneChecked(false);
  };

  const onKeyDownP2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !p2) firstRef.current?.focus();
  };

  const onKeyDownP3 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !p3) midRef.current?.focus();
  };

  const onPasteP1 = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const d = onlyDigits(text);
    if (d.length < 10) return; // 최소 10자리 이상이어야 함
    e.preventDefault();
    const np1 = d.slice(0, 3);
    const np2 = d.slice(3, 7);
    const np3 = d.slice(7, 11);
    setP1(np1);
    setP2(np2);
    setP3(np3);
    updatePhoneErr(np1, np2, np3);
    lastRef.current?.focus();
  };

  const handleCheckPhone = async () => {
    if (!isValidPhoneKRParts(p1, p2, p3)) {
      toast.error('올바른 전화번호 형식이 아닙니다.');
      return;
    }
    try {
      const phone = `${p1}${p2}${p3}`; // 숫자만 전송
      const { data } = await checkDuplicatePhone(phone);
      if (data?.isAvailable) {
        setPhoneChecked(true);
        toast.success(data?.message ?? '사용 가능한 전화번호입니다.');
      } else {
        setPhoneChecked(false);
        toast.error(data?.message ?? '이미 사용 중인 전화번호입니다.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '전화번호 중복 확인 실패');
    }
  };

  const [nickname, setNickname] = useState('');
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const nicknameTrim = nickname.trim();
  const isNicknameLenOk = nicknameTrim.length >= 2 && nicknameTrim.length <= 10;

  // 닉네임 중복확인 API 연동 전까지는 별도 플래그 불필요

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value ?? '');
    setNicknameVerified(false);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameLenOk) {
      toast.error('닉네임은 2자 이상 10자 이하여야 합니다.');
      return;
    }
    try {
      const { data } = await checkDuplicateName(nicknameTrim);
      if (data?.isAvailable) {
        setNicknameVerified(true);
        toast.success('사용 가능한 닉네임입니다.');
      } else {
        setNicknameVerified(false);
        toast.error(data?.message ?? '이미 사용 중인 닉네임입니다.');
      }
    } catch (e) {
      setNicknameVerified(false);
      toast.error(e instanceof Error ? e.message : '닉네임 중복 확인 실패');
    }
  };

  const isEmailOk = isValidEmail(email);
  const isPwOk =
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm;
  const isPhoneOk = isValidPhoneKRParts(p1, p2, p3);

  const canSubmit =
    isEmailOk &&
    isPwOk &&
    isPhoneOk &&
    emailChecked &&
    phoneChecked &&
    nicknameVerified &&
    agreements['privacy-required'];

  const allChecked = AGREEMENT_ITEMS.every(({ id }) => agreements[id]);

  const handleToggleAll = () => {
    const next = !allChecked;
    setAgreements(() =>
      AGREEMENT_ITEMS.reduce(
        (acc, { id }) => {
          acc[id] = next;
          return acc;
        },
        {} as Record<AgreementId, boolean>,
      ),
    );
  };

  const handleToggleAgreement = (id: AgreementId) => {
    setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenModal = (id: AgreementId) => {
    if (!TERMS_CONTENT[id]) return;
    setActiveModal(id);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // 회원가입 제출
  const handleSignupClick: React.MouseEventHandler<HTMLButtonElement> = async (
    e,
  ) => {
    // 버튼 내부의 기본 성공 토스트를 막기 위해 실패 시 e.preventDefault() 사용
    if (!canSubmit || submitting) {
      e.preventDefault();
      return;
    }
    try {
      setSubmitting(true);
      await signup({
        email,
        password,
        passwordConfirm,
        name: nickname,
        phone: `${p1}${p2}${p3}`,
        // 아래 필드들은 백엔드 요구 스펙에 따라 필수값으로 전송
        privacyRequiredAgreed: true,
        marketingAgreed: true,
        agreementIp: 'string',
        passwordMatching: true,
        requiredTermsAgreed: true,
      });
      // 성공 시에는 defaultPrevented가 아니므로 SignupButton 내부의 성공 토스트가 노출됨
    } catch (err) {
      e.preventDefault();
      const message = err instanceof Error ? err.message : '회원가입 실패';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 py-16 rounded-2xl border border-[var(--color-primary)] bg-white p-6 shadow-[8px_8px_0_0_var(--color-primary-40)]">
      <h1 className="mb-6 text-center text-[32px] font-bold">회원가입</h1>

      <div className="max-w-[463px] flex flex-col items-center justify-center mx-auto gap-[20px]">
        <div className="w-full flex gap-2">
          <input
            type="email"
            className="flex-1 rounded border border-gray-200 px-3 py-2 focus:border-[var(--color-primary)]"
            placeholder="이메일"
            value={email}
            onChange={onEmailChange}
            required
          />
          <button
            type="button"
            onClick={handleCheckEmail}
            disabled={!email || !!emailErr || emailChecked}
            className="rounded border border-[var(--color-primary)] bg-[var(--color-primary-20)] px-3 py-2 text-sm disabled:opacity-50"
          >
            {emailChecked ? '확인완료' : '중복확인'}
          </button>
        </div>

        {emailErr && (
          <p className="text-[12px] text-[var(--color-danger)]">{emailErr}</p>
        )}

        <input
          type="password"
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="비밀번호"
          value={password}
          onChange={onPasswordChange}
          required
        />

        {passwordErr && (
          <p className="text-[12px] text-[var(--color-danger)]">
            {passwordErr}
          </p>
        )}

        <input
          type="password"
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={onPasswordConfirmChange}
          required
        />

        {passwordConfirmErr && (
          <p className="text-[12px] text-[var(--color-danger)]">
            {passwordConfirmErr}
          </p>
        )}

        <div className="w-full flex gap-2">
          <input
            className="flex-1 rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
            placeholder="닉네임"
            value={nickname}
            onChange={onChangeNickname}
          />
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={!nicknameTrim || nicknameVerified}
            className="rounded border border-[var(--color-primary)] bg-[var(--color-primary-20)] px-3 py-2 text-sm disabled:opacity-50"
          >
            {nicknameVerified ? '확인완료' : '중복확인'}
          </button>
        </div>

        {!isNicknameLenOk && nicknameTrim.length > 0 && (
          <p className="text-[12px] text-[var(--color-danger)]">
            닉네임은 2자 이상 10자 이하여야 합니다.
          </p>
        )}

        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full mx-auto flex items-center gap-3">
            <input
              ref={firstRef}
              className="w-20 h-10 text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
              placeholder="010"
              value={p1}
              onChange={onChangeP1}
              onPaste={onPasteP1}
              inputMode="numeric"
            />
            <span>-</span>
            <input
              ref={midRef}
              className="w-24 h-10 text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
              placeholder="0000"
              value={p2}
              onChange={onChangeP2}
              onKeyDown={onKeyDownP2}
              inputMode="numeric"
            />
            <span>-</span>
            <input
              ref={lastRef}
              className="w-24 h-10 text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
              placeholder="0000"
              value={p3}
              onChange={onChangeP3}
              onKeyDown={onKeyDownP3}
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={handleCheckPhone}
              disabled={!isValidPhoneKRParts(p1, p2, p3) || phoneChecked}
              className="w-full text-center h-10 rounded border border-[var(--color-primary)] bg-[var(--color-primary-20)] px-3 py-2 text-sm disabled:opacity-50"
            >
              {phoneChecked ? '확인완료' : '중복확인'}
            </button>
          </div>
        </div>

        {phoneErr && (
          <p className="text-[12px] text-[var(--color-danger)]">{phoneErr}</p>
        )}

        <div className="w-full rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary-20)] px-5 py-4">
          <label
            htmlFor="agreement-all"
            className="flex items-center gap-3 text-base font-semibold text-[var(--color-primary)] cursor-pointer"
          >
            <input
              id="agreement-all"
              type="checkbox"
              className="sr-only"
              checked={allChecked}
              onChange={handleToggleAll}
            />
            {allChecked ? (
              <CheckboxTrue className="h-6 w-6 block" />
            ) : (
              <CheckboxFalse className="h-6 w-6 block" />
            )}
            <span>모두 동의합니다</span>
          </label>
          <div className="mt-4 space-y-3">
            {AGREEMENT_ITEMS.map(({ id, label, hasDetail }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <label
                  htmlFor={`agreement-${id}`}
                  className="flex flex-1 items-start gap-3 text-sm text-gray-600 cursor-pointer"
                >
                  <input
                    id={`agreement-${id}`}
                    type="checkbox"
                    className="sr-only"
                    checked={agreements[id]}
                    onChange={() => handleToggleAgreement(id)}
                  />
                  <span className="flex-shrink-0 leading-none">
                    {agreements[id] ? (
                      <CheckboxTrue className="h-6 w-6 block" />
                    ) : (
                      <CheckboxFalse className="h-6 w-6 block" />
                    )}
                  </span>
                  <span>{label}</span>
                </label>
                {hasDetail ? (
                  <button
                    type="button"
                    className="rounded border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    onClick={() => handleOpenModal(id)}
                  >
                    내용보기
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <SignupButton
          canSubmit={canSubmit && !submitting}
          onClick={handleSignupClick}
          aria-busy={submitting}
          className={submitting ? 'opacity-60 cursor-wait' : ''}
        />
      </div>

      {activeModal && TERMS_CONTENT[activeModal] ? (
        <Modal
          title={TERMS_CONTENT[activeModal]!.title}
          onClose={handleCloseModal}
        >
          {TERMS_CONTENT[activeModal]!.body}
        </Modal>
      ) : null}
    </div>
  );
}

export default Page;
