'use server';

import { customerValidator, pagerValidator, searchValidator } from '@/core/validators/zodschema';
import { FormState, TYPES } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import { buildQueryString } from "@/lib/utils";
import { headers } from 'next/headers';
import { container } from '@/core/di/dicontainer';
import ICustomerService from '@/core/services/contracts/ICustomerService';
import { auth } from '@/app/auth';

import { revalidatePath } from 'next/cache';

export async function customerBulkDelete(ids: string[]): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user) return;

    const customerService = container.get<ICustomerService>(TYPES.ICustomerService);
    
    // Execute deletes in parallel
    await Promise.all(ids.map(id => customerService.customerDelete(id, session.user as any)));
    
    revalidatePath('/console/customers');
  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
  }
}

export async function customerExport(formData: FormData): Promise<string | null> {
  try {
      const session = await auth();
      if (!session?.user) return null;

      const formObject = Object.fromEntries(
          Array.from(formData?.entries()).filter(([key, value]) => value !== 'DEFAULT')
      );

      const searchFields = searchValidator.safeParse(formObject);
      if (!searchFields.success) return null;

      const customerService = container.get<ICustomerService>(TYPES.ICustomerService);
      // Use a large page size to export all matching records
      const [customers, count] = await customerService.customerFindMany(
          searchFields.data, 
          { pageIndex: 1, pageSize: 100000, orderBy: 'name', orderDirection: 'asc' }, 
          session.user as any
      );

      // Convert to CSV
      if (!customers || customers.length === 0) return "";

      const headers = ["ID", "Name", "National ID", "Passport", "Phone", "Email"];
      const rows = customers.map(c => [
          c.id, 
          `"${c.name || ''}"`, 
          `"${c.nationalId || ''}"`, 
          `"${c.passport || ''}"`, 
          `"${c.phone || ''}"`, 
          `"${c.email || ''}"`
      ]);

      const csv = [
          headers.join(","),
          ...rows.map(r => r.join(","))
      ].join("\n");

      return csv;
  } catch (error) {
      c.e(error instanceof Error ? error.message : String(error));
      return null;
  }
}

export async function customerGetList(formState : FormState, formData: FormData): Promise<FormState> {
  try{
    c.fs('Actions > customerGetList');
    c.d(Object.fromEntries(formData?.entries()));

    const formObject = Object.fromEntries(
      Array.from(formData?.entries()).filter(([key, value]) => value !== 'DEFAULT')
    );

    const message = '';

    // formData is valid, further process
    let queryString = null;

    //validate and parse paging input
    c.i("Parsing pager fields from form entries.");
    const pagerFields = pagerValidator.safeParse(formObject);
    c.d(pagerFields);

    //table pager field validatd, build query string
    if(pagerFields.success){
      c.i("Pager fields validation successful. Build query string.");
      queryString = buildQueryString(pagerFields.data);
      c.d(queryString);
    }else{
      c.i("Pager fields validation failed.");
      
    }

    //validate and parse search input
    c.i("Parsing search fields from from entries.");
    const searchFields = searchValidator.safeParse(formObject);
    c.d(searchFields);

    //table pager field validatd, build query string
    if(searchFields.success){
      c.i("Search fields validation successful. Building query string.");
      queryString = queryString ? queryString + '&' + buildQueryString(searchFields.data) : buildQueryString(searchFields.data);
      c.d(queryString);
    }

    //retrieve users
    const response = await fetch(process.env.API_URL + `customers?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie')
      }
    });

    const responseData = await response.json();

    //fail
    if(!response.ok){
      c.i("Updated list retrieval failed. Return response.");
      return {error:true, message : `Customer list retrieval failed. ${responseData.message}`};
    }

    //success
    c.i("Updated list retrieval successful.");
    c.d(responseData.data?.customers?.length);
    c.d(responseData.data?.customers?.length > 0 ? responseData.data?.customers[0] : []);

    //retrieve data from tuple
    c.fe('Actions > customerGetList');
    // const [users, pager] = responseData.data;
    return {error:false, message : message, data: responseData.data.customers, pager: responseData.data.pager};
  }catch(error){
    c.e(error instanceof Error ? error.message : String(error));
    return {error:true, message : "Customer list retrieval failed."};
  }
}


export async function customerUpdate(formState : FormState, formData: FormData) : Promise<FormState>{
  try {
    c.fs('Actions > customerUpdate');
    const formObject = Object.fromEntries(
      Array.from(formData?.entries()).filter(([key, value]) => value !== 'DEFAULT')
    );

    //validate and parse form input
    const validatedFields = customerValidator.safeParse(formObject);
    c.d(validatedFields);

    //form validation fail
    if (!validatedFields.success) {
      //consoleLogger.logError(JSON.stringify(validatedFields.error.flatten().fieldErrors));
      return { error: true, message: 'Invalid inputs.', data: null, formData: null};
    }

    //form validation pass
    const { id, name } = validatedFields.data;

    //update user
    const response = await fetch(process.env.API_URL + `customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie')
      },
      body: JSON.stringify({ name }),
    });

    const responseData = await response.json();
    
    //update user failed
    if (!response.ok) {
      return { error: true, message: `Failed to update customer. ${responseData.message}`, data: null, formData: null};
    }

    //update user success
    c.fe('Actions > customerUpdate');
    return {error: false, message:"Customer update successful", data: responseData, formData: null};
  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return {error: true, message: 'Failed to update customer.', data: null, formData: null};
  }
}