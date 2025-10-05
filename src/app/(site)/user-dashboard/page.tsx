import { redirect } from 'next/navigation';

export default async function UserDashboard() {
  redirect('/user-dashboard/account-setting');
}
