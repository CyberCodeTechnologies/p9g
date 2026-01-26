'use client';

import React from "react";
import { ButtonCustom } from "../../../lib/components/web/react/uicustom/buttoncustom";
import { toast } from "sonner";
import Task from "@/core/models/domain/Task";
import TaskDetailForm from "../basicforms/taskdetailform";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../lib/components/web/react/ui/dialog";
import { taskCreate } from "@/app/(private)/console/tasks/new/actions";

interface TaskNewFormProps {
    onSaved?: (task: Task) => void;
    openCallback?: (func: {
        openDialog: (open: boolean) => void;
    }) => void;
    userMap: Map<string, string>;
    departmentMap: Map<string, string>;
}

export default function TaskNewForm({ onSaved, openCallback, userMap, departmentMap }: TaskNewFormProps) {
    
    const [resetDataToggle, setResetDataToggle] = React.useState(false);
    const [task, setTask] = React.useState<Task>({...new Task(), modelState: "inserted"});
    const [open, setOpen] = React.useState(false);


    const handleDataChanged = (task: Task) => {
        setTask(task);
    };

    const openDialog = (open: boolean) => {
        setOpen(open);
        setTask({...new Task(), modelState: "inserted"});
    };

    React.useEffect(() => {
        if (openCallback) {
            openCallback({ openDialog });
        }
    }, [openCallback]);


    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent className="w-[500px] h-auto max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    <TaskDetailForm onDataChanged={handleDataChanged} resetDataToggle={resetDataToggle} task={task} userMap={userMap} departmentMap={departmentMap} />
                    <div className="flex gap-4 sticky bottom-0 bg-background pt-2">
                        <ButtonCustom type="button" variant={"green"} onClick={async () => {
                            const result = await taskCreate(task);
                            if(result.error){
                                toast(result.message);
                            }else{
                                if(onSaved)
                                    onSaved(result.data);
                                setOpen(false);
                            }
                        }} >Create Task</ButtonCustom>
                        <ButtonCustom type="button" variant={"red"} onClick={() => setResetDataToggle(prev => !prev)}>Clear Form</ButtonCustom>
                        <ButtonCustom type="button" variant={"black"} onClick={() => setOpen(false)}>Close</ButtonCustom>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
