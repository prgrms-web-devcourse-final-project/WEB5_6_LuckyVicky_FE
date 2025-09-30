export const navItems = [
  { href: '/user-dashboard/account-setting', label: '계정 설정' },
  { href: '/user-dashboard/order-list', label: '주문 목록' },
  { href: '/user-dashboard/wish-list', label: '찜한 상품 목록' },
  { href: '/user-dashboard/follow-list', label: '팔로우하는 작가' },
  { href: '/user-dashboard/funding-list', label: '참여한 펀딩 목록' },
  {
    href: '',
    label: '작가 신청',
    subItems: [
      { href: '/user-dashboard/apply-author/apply', label: '신청하기' },
      { href: '/user-dashboard/apply-author/history', label: '신청 내역' },
    ],
  },
];
