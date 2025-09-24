'use client';

import { useState } from 'react';
import { TERMS_CONTENT } from './terms';
import { isValidEmail, isValidPassword } from '@/utils/validators';

import Modal from '@/components/Modal';
import SignupButton from '@/components/register/SignupButton';
import CheckboxTrue from '@/assets/icon/checkbox_true.svg';
import CheckboxFalse from '@/assets/icon/checkbox_false.svg';

const AGREEMENT_ITEMS = [
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

  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmErr, setPasswordConfirmErr] = useState<string | null>(null);

  const allChecked = AGREEMENT_ITEMS.every(({ id }) => agreements[id]);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? "";
    setEmail(v);
    setEmailErr(v.length === 0 ? null : isValidEmail(v) ? null : '올바른 이메일 형식이 아닙니다.');
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? "";
    setPassword(v);
    setPasswordErr(v.length === 0 ? null : isValidPassword(v) ? null : '비밀번호는 영문 대소문자, 숫자, 특수문자 포함 8자 이상이어야 합니다.');
  }

  const onPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? "";
    setPasswordConfirm(v);
    setPasswordConfirmErr(v.length === 0 ? null : v === password ? null : '비밀번호가 일치하지 않습니다.');
  }

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

  return (
    <div className="relative z-10 py-16 rounded-2xl border border-[var(--color-primary)] bg-white p-6 shadow-[8px_8px_0_0_var(--color-primary-40)]">
      <h1 className="mb-6 text-center text-[32px] font-bold">회원가입</h1>

      <div className="max-w-[463px] flex flex-col items-center justify-center mx-auto gap-[20px]">
        <input type="email" className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]" placeholder="이메일" value={email} onChange={onEmailChange} required />

        {emailErr && <p className="text-[12px] text-[var(--color-danger)]">{emailErr}</p>}

        <input
          type="password"
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="비밀번호"
          value={password}
          onChange={onPasswordChange}
          required
        />

        {passwordErr && <p className="text-[12px] text-[var(--color-danger)]">{passwordErr}</p>}

        <input
          type="password"
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={onPasswordConfirmChange}
          required
        />

        {passwordConfirmErr && <p className="text-[12px] text-[var(--color-danger)]">{passwordConfirmErr}</p>}
        
        <input
          className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="닉네임"
          required
        />
        <div className="w-full mx-auto flex flex-row gap-[30px] text-center ">
          <input
            className="w-full mx-auto text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
            placeholder="010"
            required
          />
          <span className="my-auto">-</span>
          <input
            className="w-full text-center mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
            placeholder="0000"
            required
          />
          <span className="my-auto">-</span>
          <input
            className="w-full mx-auto text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
            placeholder="0000"
            required
          />
        </div>

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
        <SignupButton disabled={!!emailErr || !!isValidEmail(email)} />
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
