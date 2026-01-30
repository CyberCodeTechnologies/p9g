"use client"

import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom";
import { InputCustom } from "@/lib/components/web/react/uicustom/inputcustom";
import { SelectCustom } from "@/lib/components/web/react/uicustom/selectcustom";
import { useFormState } from "react-dom";
import { createTask } from "../../../(private)/console/tasks/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FormState } from "@/core/types";

const initialState: FormState = {
    error: false,
    message: ""
}

export default function TaskNewForm({ userMap, departmentMap }: { userMap: Map<string, string>, departmentMap: Map<string, string> }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(createTask, initialState);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ButtonCustom>New Task</ButtonCustom>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <InputCustom name="title" label="Title" required />
                    <InputCustom name="description" label="Description" />
                    <SelectCustom name="department" label="Department" options={departmentMap} />
                    <SelectCustom name="status" label="Status" options={new Map([['Open', 'Open'], ['Done', 'Done'], ['Closed', 'Closed']])} defaultValue="Open" />
                    <InputCustom name="dueDate" label="Due Date" type="date" />
                    <SelectCustom name="assignToUserId" label="Assign To" options={userMap} />
                    <InputCustom name="notes" label="Notes" />
                    <div className="flex justify-end">
                        <ButtonCustom type="submit">Save</ButtonCustom>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
