'use server';

import { customerValidator } from '@/core/validators/zodschema';
import { FormState, TYPES } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import Customer from '@/core/models/domain/Customer';
import { auth } from '@/app/auth';
import { container } from '@/core/di/dicontainer';
import ICustomerService from '@/core/services/contracts/ICustomerService';
import { revalidatePath } from 'next/cache';

export async function customerCreate(customer: Customer) : Promise<FormState>{
  try {
    c.fs('Actions > customerCreate');
    c.d(customer);

    const session = await auth();
    if (!session?.user) {
        return { error: true, message: 'Unauthorized', data: null, formData: null};
    }

    //validate and parse form input
    const validatedFields = await customerValidator.safeParseAsync(customer);
    c.d(validatedFields);

    //form validation fail
    if (!validatedFields.success) {
      c.d(validatedFields.error.flatten().fieldErrors);
      return { error: true, message: 'Invalid inputs.', data: null, formData: null};
    }

    const customerService = container.get<ICustomerService>(TYPES.ICustomerService);
    
    // Create customer
    const createdCustomer = await customerService.customerCreate(validatedFields.data as Customer, session.user as any);

    revalidatePath('/console/customers');

    c.fe('Actions > customerCreate');
    return {error: false, message:"Customer create successful", data: createdCustomer, formData: null};
  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return {error: true, message: 'Failed to create customer.', data: null, formData: null};
  }
}
