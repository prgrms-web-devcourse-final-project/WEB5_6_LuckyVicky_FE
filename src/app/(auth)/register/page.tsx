'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/components/ToastProvider';
import { signup } from '@/services/auth';
import { TERMS_CONTENT } from './terms';
import { isValidEmail, isValidPassword , onlyDigits, isValidPhoneKRParts} from '@/utils/validators';

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 이메일
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? "";
    setEmail(v);
    setEmailErr(v.length === 0 ? null : isValidEmail(v) ? null : '올바른 이메일 형식이 아닙니다.');
  };
 

  // 비밀번호
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
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

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmErr, setPasswordConfirmErr] = useState<string | null>(null);

  // 전화번호
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [phoneErr, setPhoneErr] = useState<string | null>(null);

  const firstRef = useRef<HTMLInputElement>(null);
  const midRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  const updatePhoneErr = (np1 = p1, np2 = p2, np3 = p3) => {
    if(!np1 && !np2 && !np3) return setPhoneErr(null);
    setPhoneErr(isValidPhoneKRParts(np1, np2, np3) ? null : '올바른 전화번호 형식이 아닙니다.');
  };

  const onChangeP1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 3);
    setP1(d);
    if(d.length === 3) midRef.current?.focus();
    updatePhoneErr(d, p2, p3);
  };

  const onChangeP2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 4);
    setP2(d);
    if(d.length === 4) lastRef.current?.focus();
    updatePhoneErr(p1, d, p3);
  };

  const onChangeP3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = onlyDigits(e.target.value).slice(0, 4);
    setP3(d);
    updatePhoneErr(p1, p2, d);
  };

  const onKeyDownP2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Backspace' && !p2) firstRef.current?.focus();
  };

  const onKeyDownP3 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Backspace' && !p3) midRef.current?.focus();
  };

  const onPasteP1 = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const d = onlyDigits(text);
    if(d.length < 10) return; // 최소 10자리 이상이어야 함
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

  const [nickname, setNickname] = useState('');
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const nicknameTrim = nickname.trim();
  const isNicknameLenOk = nicknameTrim.length >= 2 && nicknameTrim.length <= 10;

  // 나중에 중복확인 로직 붙인 뒤 true로 변경
  const requireNickname = false;

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value ?? '');
    setNicknameVerified(false);
  };

  // 닉네임 중복확인 더미 핸들러 : 추후 API 연동 필요
  const handleCheckNickname = async () => {
    if (!isNicknameLenOk) {
      toast.error('닉네임은 2자 이상 10자 이하여야 합니다.');
      return;
    }
    // TODO: 중복확인 API 연동. 성공 시 아래 true로 설정
    setNicknameVerified(true);
    toast.success('사용 가능한 닉네임입니다.');
  }

   const isEmailOk = isValidEmail(email);
   const isPwOk = password.length > 0 && passwordConfirm.length > 0 && password === passwordConfirm;
   const isPhoneOk = isValidPhoneKRParts(p1, p2, p3);
   const isNicknameOk = isNicknameLenOk && nicknameVerified;

  const canSubmit = isEmailOk && isPwOk && isPhoneOk && isNicknameOk && agreements['privacy-required'];

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
  const handleSignupClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
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
        privacyRequiredAgreed: agreements['privacy-required'],
        marketingAgreed: agreements['privacy-optional'],
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
       <input
      type="email"
      className="w-full mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
      placeholder="이메일"
      value={email}
      onChange={onEmailChange}
      required
      />

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
            disabled={!nickname.trim() || nicknameVerified}
            className="rounded border border-[var(--color-primary)] bg-[var(--color-primary-20)] px-3 py-2 text-sm disabled:opacity-50"
          >
            {nicknameVerified ? '확인완료' : '중복확인'}
          </button>
        </div>

        {!isNicknameLenOk && nicknameTrim.length > 0 && (
          <p className="text-[12px] text-[var(--color-danger)]">닉네임은 2자 이상 10자 이하여야 합니다.</p>
        )}


        <div className="w-full mx-auto flex flex-row gap-[30px] text-center">
        <input
          ref={firstRef}
          className="w-full mx-auto text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="010"
          value={p1}
          onChange={onChangeP1}
          onPaste={onPasteP1}
          inputMode="numeric"
        />
        <span className="my-auto">-</span>
        <input
          ref={midRef}
          className="w-full text-center mx-auto rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="0000"
          value={p2}
          onChange={onChangeP2}
          onKeyDown={onKeyDownP2}
          inputMode="numeric"
        />
        <span className="my-auto">-</span>
        <input
          ref={lastRef}
          className="w-full mx-auto text-center rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
          placeholder="0000"
          value={p3}
          onChange={onChangeP3}
          onKeyDown={onKeyDownP3}
          inputMode="numeric"
        />
      </div>

      {phoneErr && <p className="text-[12px] text-[var(--color-danger)]">{phoneErr}</p>}


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
