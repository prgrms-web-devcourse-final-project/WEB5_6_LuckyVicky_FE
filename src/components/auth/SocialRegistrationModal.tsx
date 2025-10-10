'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/components/ToastProvider';
import { isValidEmail, isValidPhoneKRParts, onlyDigits } from '@/utils/validators';
import {
  checkDuplicateEmail,
  checkDuplicateName,
  checkDuplicatePhone,
} from '@/services/auth';

const inputClass =
  'w-full rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]';

const phoneInputClass =
  'w-full rounded border border-gray-200 px-3 py-2 text-center outline-none transition-colors duration-150 focus:border-[var(--color-primary)]';

const sectionClass =
  'flex w-full flex-col gap-4 rounded-2xl ';

export type SocialRegistrationValues = {
  email: string;
  nickname: string;
  phone: string;
};

type SocialRegistrationModalProps = {
  open: boolean;
  defaultValues?: Partial<SocialRegistrationValues> & { name?: string };
  onClose: () => void;
  onSubmit: (values: SocialRegistrationValues) => Promise<void>;
  disableEmail?: boolean;
  disableNickname?: boolean;
};

function extractPhoneParts(value?: string) {
  if (!value) return ['', '', ''];
  const digits = onlyDigits(value).slice(0, 11);
  const first = digits.slice(0, 3);
  const second = digits.slice(3, 7);
  const third = digits.slice(7, 11);
  return [first, second, third] as const;
}

export default function SocialRegistrationModal({
  open,
  defaultValues,
  onClose,
  onSubmit,
  disableEmail = false,
  disableNickname = false,
}: SocialRegistrationModalProps) {
  const toast = useToast();
  const [email, setEmail] = useState(defaultValues?.email ?? '');
  const [nickname, setNickname] = useState(defaultValues?.nickname ?? '');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [emailChecked, setEmailChecked] = useState(disableEmail);
  const [nicknameChecked, setNicknameChecked] = useState(disableNickname);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const firstRef = useRef<HTMLInputElement>(null);
  const midRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const [fp1, fp2, fp3] = extractPhoneParts(defaultValues?.phone);
    setEmail(defaultValues?.email ?? '');
    setNickname(defaultValues?.nickname ?? defaultValues?.name ?? '');
    setP1(fp1);
    setP2(fp2);
    setP3(fp3);
    setEmailChecked(disableEmail);
    setNicknameChecked(disableNickname);
    setPhoneChecked(false);
  }, [defaultValues, disableEmail, disableNickname, open]);

  const nicknameTrim = nickname.trim();
  const isNicknameLenOk = nicknameTrim.length >= 2 && nicknameTrim.length <= 10;

  const phoneDigits = useMemo(() => `${p1}${p2}${p3}`, [p1, p2, p3]);

  const handleCheckEmail = async () => {
    if (disableEmail) {
      setEmailChecked(true);
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('올바른 이메일 형식이 아닙니다.');
      return;
    }
    try {
      const { data } = await checkDuplicateEmail(email);
      if (data?.isAvailable) {
        toast.success(data?.message ?? '사용 가능한 이메일입니다.');
        setEmailChecked(true);
      } else {
        toast.error(data?.message ?? '이미 사용 중인 이메일입니다.');
        setEmailChecked(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이메일 중복 확인 실패');
      setEmailChecked(false);
    }
  };

  const handleCheckNickname = async () => {
    if (disableNickname) {
      setNicknameChecked(true);
      return;
    }
    if (!isNicknameLenOk) {
      toast.error('닉네임은 2자 이상 10자 이하여야 합니다.');
      return;
    }
    try {
      const { data } = await checkDuplicateName(nicknameTrim);
      if (data?.isAvailable) {
        toast.success(data?.message ?? '사용 가능한 닉네임입니다.');
        setNicknameChecked(true);
      } else {
        toast.error(data?.message ?? '이미 사용 중인 닉네임입니다.');
        setNicknameChecked(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '닉네임 중복 확인 실패');
      setNicknameChecked(false);
    }
  };

  const handleCheckPhone = async () => {
    if (!isValidPhoneKRParts(p1, p2, p3)) {
      toast.error('올바른 전화번호 형식이 아닙니다.');
      return;
    }
    try {
      const { data } = await checkDuplicatePhone(phoneDigits);
      if (data?.isAvailable) {
        toast.success(data?.message ?? '사용 가능한 전화번호입니다.');
        setPhoneChecked(true);
      } else {
        toast.error(data?.message ?? '이미 사용 중인 전화번호입니다.');
        setPhoneChecked(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '전화번호 중복 확인 실패');
      setPhoneChecked(false);
    }
  };

  const isEmailValid = disableEmail || isValidEmail(email);
  const isNicknameValid = disableNickname || isNicknameLenOk;
  const isPhoneValid = isValidPhoneKRParts(p1, p2, p3);
  const canSubmit =
    isEmailValid &&
    isNicknameValid &&
    isPhoneValid &&
    (disableEmail || emailChecked) &&
    (disableNickname || nicknameChecked) &&
    phoneChecked &&
    !submitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error('입력값을 확인해 주세요.');
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit({
        email,
        nickname: nicknameTrim,
        phone: `${p1}-${p2}-${p3}`,
      });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '추가 정보 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      title="추가 정보 입력"
      onClose={submitting ? () => undefined : onClose}
      showFooter={false}
      maxWidthClassName="max-w-[620px]"
      contentClassName="bg-transparent"
      className="mb-4"
    >
      <form className="flex justify-center" onSubmit={handleSubmit}>
        <div className={sectionClass}>
          <div className="flex w-full flex-col gap-2">
            <label className="flex flex-col gap-2 text-sm text-[var(--color-gray-700)]">
              <span className="font-medium text-[var(--color-gray-900)]">이메일</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (!disableEmail) {
                      setEmailChecked(false);
                    }
                  }}
                  className={inputClass}
                  placeholder="이메일"
                  disabled={disableEmail}
                  required
                />
                {disableEmail ? null : (
                  <Button className="shrink-0" type="button" variant="outline" onClick={handleCheckEmail}>
                    중복확인
                  </Button>
                )}
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[var(--color-gray-700)]">
              <span className="font-medium text-[var(--color-gray-900)]">닉네임</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    if (!disableNickname) {
                      setNicknameChecked(false);
                    }
                  }}
                  className={inputClass}
                  placeholder="닉네임"
                  disabled={disableNickname}
                  required
                />
                {disableNickname ? null : (
                  <Button className="shrink-0" type="button" variant="outline" onClick={handleCheckNickname}>
                    중복확인
                  </Button>
                )}
              </div>
              <p className="text-xs text-[var(--color-gray-500)]">닉네임은 2자 이상 10자 이하로 입력해 주세요.</p>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[var(--color-gray-700)]">
              <span className="font-medium text-[var(--color-gray-900)]">전화번호</span>
              <div className="flex items-center gap-2">
                <input
                  ref={firstRef}
                  type="text"
                  value={p1}
                  onChange={(event) => {
                    const value = onlyDigits(event.target.value).slice(0, 3);
                    setP1(value);
                    if (value.length === 3) midRef.current?.focus();
                    setPhoneChecked(false);
                  }}
                  className={phoneInputClass}
                  placeholder="010"
                />
                <span className="text-[var(--color-gray-400)]">-</span>
                <input
                  ref={midRef}
                  type="text"
                  value={p2}
                  onChange={(event) => {
                    const value = onlyDigits(event.target.value).slice(0, 4);
                    setP2(value);
                    if (value.length === 4) lastRef.current?.focus();
                    setPhoneChecked(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && p2.length === 0) {
                      firstRef.current?.focus();
                    }
                  }}
                  className={phoneInputClass}
                  placeholder="0000"
                />
                <span className="text-[var(--color-gray-400)]">-</span>
                <input
                  ref={lastRef}
                  type="text"
                  value={p3}
                  onChange={(event) => {
                    const value = onlyDigits(event.target.value).slice(0, 4);
                    setP3(value);
                    setPhoneChecked(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && p3.length === 0) {
                      midRef.current?.focus();
                    }
                  }}
                  className={phoneInputClass}
                  placeholder="0000"
                />
                <Button className="shrink-0"type="button" variant="outline" onClick={handleCheckPhone}>
                  중복확인
                </Button>
              </div>
            </label>
          </div>

          <Button type="submit" disabled={!canSubmit}>
            {submitting ? '저장 중…' : '저장하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
