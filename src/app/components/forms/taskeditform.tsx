"use client"

import { ButtonCustom } from "@/lib/components/web/react/uicustom/buttoncustom";
import { InputCustom } from "@/lib/components/web/react/uicustom/inputcustom";
import { SelectCustom } from "@/lib/components/web/react/uicustom/selectcustom";
import { useFormState } from "react-dom";
import { updateTask } from "../../../(private)/console/tasks/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FormState } from "@/core/types";
import Task from "@/core/models/domain/Task";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialState: FormState = {
    error: false,
    message: ""
}

export default function TaskEditForm({ task, userMap, departmentMap }: { task: any, userMap: Map<string, string>, departmentMap: Map<string, string> }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(updateTask, initialState);

    const formatDate = (date: string | Date | null) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    };
    
    const formatDateTime = (date: string | Date | null) => {
        if (!date) return "";
        // For datetime-local input, format as YYYY-MM-DDTHH:MM
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ButtonCustom variant="outline" size="sm">Edit</ButtonCustom>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-2">
                    <form action={formAction} className="grid gap-4">
                        <input type="hidden" name="id" value={task.id} />
                        <InputCustom name="title" label="Title" required defaultValue={task.title} />
                        <InputCustom name="description" label="Description" defaultValue={task.description || ""} />
                        <SelectCustom name="department" label="Department" options={departmentMap} defaultValue={task.department || ""} />
                        <SelectCustom name="status" label="Status" options={new Map([['Open', 'Open'], ['Done', 'Done'], ['Closed', 'Closed']])} defaultValue={task.status} />
                        <InputCustom name="dueDate" label="Due Date" type="date" defaultValue={formatDate(task.dueDate)} />
                        <InputCustom name="completedDate" label="Completed Date/Time" type="datetime-local" defaultValue={formatDateTime(task.completedDate)} />
                        <SelectCustom name="assignToUserId" label="Assign To" options={userMap} defaultValue={task.assignToUserId || ""} />
                        <InputCustom name="notes" label="Notes" defaultValue={task.notes || ""} />
                        <div className="flex justify-end pt-4">
                            <ButtonCustom type="submit">Save Changes</ButtonCustom>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
