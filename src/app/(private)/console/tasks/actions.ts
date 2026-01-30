"use server"

import { container } from "@/core/di/dicontainer";
import { TYPES, FormState } from "@/core/types";
import type ITaskService from "@/core/services/contracts/ITaskService";
import { auth } from "@/app/auth";
import Task from "@/core/models/domain/Task";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    department: z.string().optional(),
    status: z.string().default("Open"),
    assignToUserId: z.string().optional(),
    dueDate: z.string().optional(),
    notes: z.string().optional()
});

export async function createTask(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await auth();
    if (!session || !session.user) return { error: true, message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    const validated = taskSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: true, message: "Validation Error", data: validated.error.flatten() };
    }

    const service = container.get<ITaskService>(TYPES.ITaskService);
    const task = new Task();
    task.title = validated.data.title;
    task.description = validated.data.description || null;
    task.department = validated.data.department || null;
    task.status = validated.data.status;
    task.assignToUserId = validated.data.assignToUserId || null;
    task.dueDate = validated.data.dueDate ? new Date(validated.data.dueDate) : null;
    task.notes = validated.data.notes || null;
    task.createdBy = session.user.id;
    task.updatedBy = session.user.id;

    await service.create(task);
    revalidatePath("/console/tasks");
    return { error: false, message: "Task created successfully" };
}

export async function updateTask(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await auth();
    if (!session || !session.user) return { error: true, message: "Unauthorized" };

    const id = formData.get("id") as string;
    if (!id) return { error: true, message: "ID required" };

    const rawData = Object.fromEntries(formData.entries());
    
    const service = container.get<ITaskService>(TYPES.ITaskService);
    const task = await service.getById(id);
    if (!task) return { error: true, message: "Task not found" };

    task.title = rawData.title as string;
    task.description = rawData.description as string || null;
    task.department = rawData.department as string || null;
    task.status = rawData.status as string;
    task.assignToUserId = rawData.assignToUserId as string || null;
    task.dueDate = rawData.dueDate ? new Date(rawData.dueDate as string) : null;
    task.notes = rawData.notes as string || null;
    task.updatedBy = session.user.id;
    
    if (rawData.completedDate) {
        task.completedDate = new Date(rawData.completedDate as string);
    } else if (task.status === 'Done' || task.status === 'Closed') {
         if (!task.completedDate) task.completedDate = new Date();
    } else {
         task.completedDate = null;
    }

    await service.update(task);
    revalidatePath("/console/tasks");
    return { error: false, message: "Task updated successfully" };
}
