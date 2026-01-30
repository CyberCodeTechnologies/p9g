"use server"

import { container } from "@/core/di/dicontainer";
import { TYPES } from "@/core/types";
import type ITaskNoteService from "@/core/services/contracts/ITaskNoteService";
import { auth } from "@/app/auth";
import TaskNote from "@/core/models/domain/TaskNote";

export async function getTaskNotes(taskId: string) {
    const service = container.get<ITaskNoteService>(TYPES.ITaskNoteService);
    const notes = await service.getByTaskId(taskId);
    // Serialize
    return JSON.parse(JSON.stringify(notes));
}

export async function createTaskNote(taskId: string, content: string, type: string) {
    const session = await auth();
    if (!session || !session.user) throw new Error("Unauthorized");

    const service = container.get<ITaskNoteService>(TYPES.ITaskNoteService);
    const note = new TaskNote();
    note.taskId = taskId;
    note.content = content;
    note.type = type;
    note.createdBy = session.user.id;
    note.updatedBy = session.user.id;
    
    await service.create(note);
    return { success: true };
}
