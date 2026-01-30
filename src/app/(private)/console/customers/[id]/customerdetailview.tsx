'use client';

import React, { useRef } from 'react';
import { Group, GroupContent, GroupTitle } from "@/lib/components/web/react/uicustom/group";
import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom";
import Link from 'next/link';
import Customer from '@/core/models/domain/Customer';
import CustomerEditForm from '@/app/components/forms/customereditform';
import { useRouter } from 'next/navigation';

export default function CustomerDetailView({ customer: initialCustomer }: { customer: Customer }) {
    const router = useRouter();
    const [customer, setCustomer] = React.useState(initialCustomer);
    const openDialogRef = useRef<((open: boolean) => void) | null>(null);
    const setEditCustomerRef = useRef<((customer: Customer) => void) | null>(null);

    const handleEditClick = () => {
        if (openDialogRef.current && setEditCustomerRef.current) {
            setEditCustomerRef.current(customer);
            openDialogRef.current(true);
        }
    };

    const handleSaved = (updatedCustomer: Customer) => {
        setCustomer(updatedCustomer);
        router.refresh();
    };

    return (
        <div className="flex flex-1 w-auto p-4">
            <Group className="flex flex-1 w-auto flex-col">
                <GroupTitle>
                    Customer Details
                </GroupTitle>
                <GroupContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><strong>ID:</strong> {customer.id}</div>
                            <div><strong>Name:</strong> {customer.name}</div>
                            <div><strong>English Name:</strong> {customer.englishName}</div>
                            <div><strong>National ID:</strong> {customer.nationalId}</div>
                            <div><strong>Passport:</strong> {customer.passport}</div>
                            <div><strong>Phone:</strong> {customer.phone}</div>
                            <div><strong>Email:</strong> {customer.email}</div>
                            <div><strong>DOB:</strong> {customer.dob ? new Date(customer.dob).toLocaleDateString() : ''}</div>
                            <div><strong>Gender:</strong> {customer.gender}</div>
                            <div><strong>Address:</strong> {customer.address}</div>
                            <div><strong>Country:</strong> {customer.country}</div>
                        </div>
                        <div className="flex gap-2 mt-4">
                             <ButtonCustom variant="blue" onClick={handleEditClick}>Edit</ButtonCustom>
                             <Link href="/console/customers">
                                <ButtonCustom variant="gray">Back to List</ButtonCustom>
                             </Link>
                        </div>
                    </div>
                </GroupContent>
            </Group>
            <CustomerEditForm 
                onSaved={handleSaved} 
                openCallback={(funcs) => {
                    openDialogRef.current = funcs.openDialog;
                    setEditCustomerRef.current = funcs.setEditCustomer;
                }}
            />
        </div>
    );
}
