'use client';

import React from "react";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import { toast } from "sonner";
import Task from "@/core/models/domain/Task";
import TaskDetailForm from "../basicforms/taskdetailform";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../lib/components/web/react/ui/dialog";
import { taskUpdate } from "@/app/(private)/console/tasks/[id]/edit/actions";

interface TaskEditFormProps {
    onSaved?: (task: Task) => void;
    openCallback?: (func: {
        openDialog: (open: boolean) => void;
        setEditTask: (task:Task) => void;
    }) => void;
    userMap: Map<string, string>;
    departmentMap: Map<string, string>;
}

export default function TaskEditForm({ onSaved, openCallback, userMap, departmentMap }: TaskEditFormProps) {
    
    const [resetDataToggle, setResetDataToggle] = React.useState(false);
    const [task, setTask] = React.useState(new Task());
    const [open, setOpen] = React.useState(false);


    const handleDataChanged = (task: Task) => {
        setTask(task);
    };

    const openDialog = (open: boolean) => {
        setOpen(open);
    };

    const setEditTask = (task: Task) => {
        setTask(task);
    };

    React.useEffect(() => {
        if (openCallback) {
            openCallback({ openDialog, setEditTask });
        }
    }, [openCallback]);


    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="h-auto w-auto">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <TaskDetailForm onDataChanged={handleDataChanged} resetDataToggle={resetDataToggle} task={task} userMap={userMap} departmentMap={departmentMap} />
                    <div className="flex gap-4">
                        <ButtonCustom type="button" variant={"green"} onClick={async () => {
                            const result = await taskUpdate(task);
                            if(result.error){
                                toast(result.message);
                            }else{
                                if(onSaved)
                                    onSaved(task);
                                setOpen(false);
                            }
                        }} >Update Task</ButtonCustom>
                        <ButtonCustom type="button" variant={"black"} onClick={() => setOpen(false)}>Close</ButtonCustom>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
