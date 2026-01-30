'use server';
import { redirect } from 'next/navigation';
import { signIn } from "@/app/auth";
import c from '@/lib/loggers/console/ConsoleLogger';
import { AppUrl } from '@/core/constants';
import { FormState, TYPES } from '@/core/types';
import { container } from '@/core/di/dicontainer';
import IAuthService from '@/core/services/contracts/IAuthService';


export async function signInAction(state : FormState, formData:FormData){
    try {
        c.fs("signInAction");
        //retreive 
        const formObject = Object.fromEntries(formData.entries());
        const { userName, password } = formObject;

        //check credentials
        const authService = container.get<IAuthService>(TYPES.IAuthService);
        const user = await authService.signMeIn(String(userName), String(password));

        //credential check failed, return response
        if(!user)
            return {error: true,  message : "Invalid username and password.", formData: formData};

        // valid credentials, sign the user in
        c.fe("signInAction");
        await signIn('credentials',  {redirect : false, name:user.userName, id: user.id, role: user.role, location: user.location});
    } catch (error) {
        c.e(error instanceof Error ? error.message : String(error));
        // Log detailed error info including hidden properties
        if (typeof error === 'object' && error !== null) {
            c.e('Error Details: ' + JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
        return {error: true,  message: "Unknown error.", formData: formData};
    }
    //if we come this far, we are ok with sign in process, safely redirect now
    redirect(AppUrl.main);
}