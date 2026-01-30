import { container } from '@/core/di/dicontainer';
import { TYPES } from '@/core/types';
import ICustomerService from '@/core/services/contracts/ICustomerService';
import { auth } from '@/app/auth';
import { notFound } from 'next/navigation';
import CustomerDetailView from './customerdetailview';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user) return null;

    const customerService = container.get<ICustomerService>(TYPES.ICustomerService);
    const customer = await customerService.customerFindById(params.id, session.user as any);

    if (!customer) {
        notFound();
    }

    return <CustomerDetailView customer={customer} />;
}
