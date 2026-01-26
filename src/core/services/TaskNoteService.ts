import { injectable, inject } from 'inversify';

import c from '@/lib/loggers/console/ConsoleLogger';
import type ITaskNoteService from "./contracts/ITaskNoteService";
import { TYPES } from '@/core/types';
import TaskNote from '../models/domain/TaskNote';
import SessionUser from '../models/dto/SessionUser';
import type IRepository from '@/lib/repositories/IRepository';
import { eq, desc } from '@/lib/transformers/types';

@injectable()
export default class TaskNoteService implements ITaskNoteService {

  constructor(
    @inject(TYPES.ITaskNoteRepository) private taskNoteRepository: IRepository<TaskNote>
  ) {

  }

  async taskNoteCreate(taskNote: TaskNote, sessionUser: SessionUser): Promise<TaskNote> {
    c.fs('TaskNoteService > taskNoteCreate');

    taskNote.createdAtUTC = new Date();
    taskNote.createdBy = sessionUser.id;
    taskNote.updatedAtUTC = new Date();
    taskNote.updatedBy = sessionUser.id;

    return await this.taskNoteRepository.create(taskNote);
  }

  async taskNoteFindMany(taskId: string, sessionUser: SessionUser): Promise<TaskNote[]> {
    c.fs('TaskNoteService > taskNoteFindMany');
    return await this.taskNoteRepository.findMany(eq('taskId', taskId), desc("createdAtUTC"), 0, 1000);
  }

}
