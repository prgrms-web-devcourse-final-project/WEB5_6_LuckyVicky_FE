import AuthorRequestModal from '@/components/user-dashboard/AuthorRequestModal';
import ExchangeRefundModal from '@/components/user-dashboard/ExchangeRefundModal';

function page() {
  return (
    <div>
      <ExchangeRefundModal />
      <AuthorRequestModal />
    </div>
  );
}
export default page;
