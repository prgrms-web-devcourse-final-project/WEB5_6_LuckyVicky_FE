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