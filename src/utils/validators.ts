export function isValidEmail(v: string) {
  if (!v) return false;
  const s = v.trim();
  // 기본 형태 + 마지막 라벨 2자 이상
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
  // 추가: 연속 점 금지, 시작/끝 점 금지
  const extra =
    !s.includes('..') &&
    !s.startsWith('.') &&
    !s.endsWith('.') &&
    !s.includes('@.') &&
    !s.includes('.@');
  return basic && extra;
}

export function isValidPassword(v: string) {
  if (!v) return false;
  const s = v.trim();
  // 8-20자, 영문 대소문자, 숫자, 특수문자 포함
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-=/])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-=/]{8,20}$/;
  return re.test(s);
}

export function onlyDigits(v: string) {
return (v ?? '').replace(/\D/g, '');
}

export function isValidPhoneKRParts(p1: string, p2: string, p3: string) {
// 기본 정책: 010-####-#### 만 허용
return p1 === '010' && /^\d{4}$/.test(p2) && /^\d{4}$/.test(p3);
}