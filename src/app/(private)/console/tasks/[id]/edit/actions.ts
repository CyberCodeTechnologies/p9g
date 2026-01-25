'use server';

import { taskValidator } from '@/core/validators/zodschema';
import { FormState } from "@/core/types";
import c from "@/lib/loggers/console/ConsoleLogger";
import Task from '@/core/models/domain/Task';
import { headers } from 'next/headers';


export async function taskUpdate(task: Task) : Promise<FormState>{
  try {
    c.fs('Actions > taskUpdate');
    c.d(task);

    //validate and parse form input
    const validatedFields = await taskValidator.safeParseAsync(task);
    c.d(validatedFields);

    //form validation fail
    if (!validatedFields.success) {
      c.d(validatedFields.error.flatten().fieldErrors);
      return { error: true, message: 'Invalid inputs.', data: null, formData: null};
    }

    //update user
    const response = await fetch(process.env.API_URL + `tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'cookie': (await headers()).get('cookie') || ''
      },
      body: JSON.stringify(validatedFields.data),
    });

    const responseData = await response.json();
    
    //update user failed
    if (!response.ok) {
      c.e(responseData.message);
      return { error: true, message: `Failed to update task. ${responseData.message}`};
    }

    //update user success
    c.fe('Actions > taskUpdate');
    return {error: false, message:"Task update successful", data: responseData.data, formData: null};
  } catch (error) {
    c.e(error instanceof Error ? error.message : String(error));
    return {error: true, message: 'Failed to update task.', data: null, formData: null};
  }
}
