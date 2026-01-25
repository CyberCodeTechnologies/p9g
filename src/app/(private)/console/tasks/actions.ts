'use server';

import { taskValidator, pagerValidator, searchValidator } from '@/core/validators/zodschema';
import { FormState } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import { buildQueryString } from "@/lib/utils";
import { headers } from 'next/headers';

export async function taskGetList(formState : FormState, formData: FormData): Promise<FormState> {
  try{
    c.fs('Actions > taskGetList');
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

    //retrieve tasks
    const response = await fetch(process.env.API_URL + `tasks?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie') || ''
      }
    });

    const responseData = await response.json();

    //fail
    if(!response.ok){
      c.i("Updated list retrieval failed. Return response.");
      return {error:true, message : `Task list retrieval failed. ${responseData.message}`, data: [], pager: { pageIndex: 0, pageSize: 10, records: 0, pages: 0 }};
    }

    //success
    c.i("Updated list retrieval successful.");
    c.d(responseData.data?.tasks?.length);

    //retrieve data from tuple
    c.fe('Actions > taskGetList');
    return {error:false, message : message, data: responseData.data.tasks, pager: responseData.data.pager};
  }catch(error){
    c.e(error instanceof Error ? error.message : String(error));
    return {error:true, message : "Task list retrieval failed.", data: [], pager: { pageIndex: 0, pageSize: 10, records: 0, pages: 0 }};
  }
}


export async function taskUpdate(formState : FormState, formData: FormData) : Promise<FormState>{
  try {
    c.fs('Actions > taskUpdate');
    const formObject = Object.fromEntries(
      Array.from(formData?.entries()).filter(([key, value]) => value !== 'DEFAULT')
    );

    //validate and parse form input
    const validatedFields = taskValidator.safeParse(formObject);
    c.d(validatedFields);

    //form validation fail
    if (!validatedFields.success) {
      return { error: true, message: 'Invalid inputs.', data: null, formData: null};
    }

    //form validation pass
    c.i("Form validation successful. Calling API.");
    const response = await fetch(process.env.API_URL + `tasks/${validatedFields.data.id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedFields.data),
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie') || ''
      }
    });

    const responseData = await response.json();

    //api fail
    if (!response.ok) {
      c.i("Update failed. Return response.");
      return { error: true, message: responseData.message };
    }

    //success
    c.i("Update successful.");
    return await taskGetList(formState, formData);

  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return { error: true, message: "Update failed." };
  }
}

export async function taskCreate(formState : FormState, formData: FormData) : Promise<FormState>{
  try {
    c.fs('Actions > taskCreate');
    const formObject = Object.fromEntries(
      Array.from(formData?.entries()).filter(([key, value]) => value !== 'DEFAULT')
    );

    const validatedFields = taskValidator.safeParse(formObject);
    c.d(validatedFields);

    //form validation fail
    if (!validatedFields.success) {
      return { error: true, message: 'Invalid inputs.', data: null, formData: null};
    }

    //form validation pass
    c.i("Form validation successful. Calling API.");
    const response = await fetch(process.env.API_URL + `tasks`, {
      method: 'POST',
      body: JSON.stringify(validatedFields.data),
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie') || ''
      }
    });

    const responseData = await response.json();

    //api fail
    if (!response.ok) {
      c.i("Create failed. Return response.");
      return { error: true, message: responseData.message };
    }

    //success
    c.i("Create successful.");
    return await taskGetList(formState, formData);

  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return { error: true, message: "Create failed." };
  }
}

export async function taskDelete(formState : FormState, formData: FormData) : Promise<FormState>{
    try {
        c.fs('Actions > taskDelete');
        const id = formData.get('id');

        if (!id) {
            return { error: true, message: 'Invalid inputs.' };
        }

        c.i("Calling API.");
        const response = await fetch(process.env.API_URL + `tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'cookie': (await headers()).get('cookie') || ''
            }
        });

        const responseData = await response.json();

        //api fail
        if (!response.ok) {
            c.i("Delete failed. Return response.");
            return { error: true, message: responseData.message };
        }

        //success
        c.i("Delete successful.");
        return await taskGetList(formState, formData);

    } catch (error) {
        c.e(error instanceof Error ? error.message : String(error));
        return { error: true, message: "Delete failed." };
    }
}
