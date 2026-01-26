"use server";

import { auth } from "@/app/auth";
import { container } from "@/core/di/dicontainer";
import { TYPES } from "@/core/types";
import ITaskNoteService from "@/core/services/contracts/ITaskNoteService";
import TaskNote from "@/core/models/domain/TaskNote";
import SessionUser from "@/core/models/dto/SessionUser";

export async function getTaskNotes(taskId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const taskNoteService = container.get<ITaskNoteService>(TYPES.ITaskNoteService);
  const notes = await taskNoteService.taskNoteFindMany(taskId, session.user as SessionUser);
  return JSON.parse(JSON.stringify(notes));
}

export async function createTaskNote(taskId: string, content: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const taskNoteService = container.get<ITaskNoteService>(TYPES.ITaskNoteService);
  const note = new TaskNote();
  note.taskId = taskId;
  note.content = content;
  note.type = "NOTE";

  const createdNote = await taskNoteService.taskNoteCreate(note, session.user as SessionUser);
  return JSON.parse(JSON.stringify(createdNote));
}
