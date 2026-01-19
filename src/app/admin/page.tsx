import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect('/admin/login');
    }

    return <AdminDashboardClient userEmail={session.user.email || ''} />;
}
