export function getTimezone(): string {
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn('Failed to detect timezone', error);
    }
  }
  return 'Asia/Seoul';
}
