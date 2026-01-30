'use server';

import { customerValidator } from '@/core/validators/zodschema';
import { FormState, TYPES } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import Customer from '@/core/models/domain/Customer';
import { auth } from '@/app/auth';
import { container } from '@/core/di/dicontainer';
import ICustomerService from '@/core/services/contracts/ICustomerService';
import { revalidatePath } from 'next/cache';

export async function customerUpdate(customer: Customer) : Promise<FormState>{
  try {
    c.fs('Actions > customerUpdate');
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
    
    // We need to update the customer. The service method is customerUpdate(id, customer, sessionUser).
    await customerService.customerUpdate(customer.id, validatedFields.data as Customer, session.user as any);

    revalidatePath('/console/customers');
    revalidatePath(`/console/customers/${customer.id}`);

    //update user success
    c.fe('Actions > customerUpdate');
    return {error: false, message:"Customer update successful", data: validatedFields.data, formData: null};
  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return {error: true, message: 'Failed to update customer.', data: null, formData: null};
  }
}
