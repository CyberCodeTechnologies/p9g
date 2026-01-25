'use client';

import { Label } from "@/lib/components/web/react/ui/label";
import { InputWithLabel } from "../../../lib/components/web/react/uicustom/inputwithlabel";
import { Textarea } from "../../../lib/components/web/react/ui/textarea";
import React from "react";
import Task from "@/core/models/domain/Task";
import { SelectListForm } from "@/core/constants";
import { SelectWithLabel } from "@/lib/components/web/react/uicustom/selectwithlabel";


interface TaskDetailFormProps {
    task: Task;
    resetDataToggle: boolean;
    onDataChanged: (task: Task) => void;
    userMap: Map<string, string>;
    departmentMap: Map<string, string>;
}

export default function TaskDetailForm({ task, resetDataToggle, onDataChanged, userMap, departmentMap }: TaskDetailFormProps) {

    const [localTask, setLocalTask] = React.useState<Task>(task);

    React.useEffect(() => {
        setLocalTask(new Task());
    }, [resetDataToggle]);

    React.useEffect(() => {
        if (task)
            setLocalTask(task);
    }, [task]);

    return (
        <div className="flex flex-col gap-4">
            <InputWithLabel name="title" label="Title" variant="default" size={"full"} labelPosition="top" onBlur={() => onDataChanged(localTask)}
                value={localTask?.title ?? ''} onChange={(e) => setLocalTask(prev => ({ ...prev, title: e.target.value }))} />
            
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder=" ..." value={localTask?.description ?? ''} onBlur={() => onDataChanged(localTask)}
                onChange={(e) => setLocalTask(prev => ({ ...prev, description: e.target.value }))} />

            <SelectWithLabel name="department" label="Department" size="sm" labelPosition="top" items={departmentMap}
                value={localTask?.department} onValueChange={value => {
                    setLocalTask(prev => ({ ...prev, department: value }));
                    onDataChanged({...localTask, department: value});
            }}
            />

            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder=" ..." value={localTask?.notes ?? ''} onBlur={() => onDataChanged(localTask)}
                onChange={(e) => setLocalTask(prev => ({ ...prev, notes: e.target.value }))} />

            <SelectWithLabel name="status" label="Status" size="sm" labelPosition="top" items={SelectListForm.TASK_STATUS}
                value={localTask?.status} onValueChange={value => {
                    setLocalTask(prev => ({ ...prev, status: value }));
                    onDataChanged({...localTask, status: value});
            }}
            />
            
            <SelectWithLabel name="assignToUserId" label="Assign To User" size="sm" labelPosition="top" items={userMap}
                value={localTask?.assignToUserId} onValueChange={value => {
                    setLocalTask(prev => ({ ...prev, assignToUserId: value }));
                    onDataChanged({...localTask, assignToUserId: value});
            }}
            />
        </div>
    );
};
