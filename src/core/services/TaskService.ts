import { injectable, inject } from 'inversify';

import c from '@/lib/loggers/console/ConsoleLogger';
import type ITaskService from "./contracts/ITaskService";
import { PagerParams, SearchFormFields, TYPES } from '@/core/types';
import Task from '../models/domain/Task';
import SessionUser from '../models/dto/SessionUser';
import type IRepository from '@/lib/repositories/IRepository';
import { buildAnyCondition } from '@/core/helpers';
import { asc } from '@/lib/transformers/types';


@injectable()
export default class TaskService implements ITaskService {

  constructor(
    @inject(TYPES.ITaskRepository) private taskRepository: IRepository<Task>
  ) {

  }


  async taskCreate(task: Task, sessionUser: SessionUser): Promise<Task> {
    c.fs('TaskService > taskCreate');

    task.createdAtUTC = new Date();
    task.createdBy = sessionUser.id;
    task.updatedAtUTC = new Date();
    task.updatedBy = sessionUser.id;

    return await this.taskRepository.create(task);
  }


  async taskDelete(id: string, sessionUser: SessionUser): Promise<void> {
    c.fs('TaskService > taskDelete');
    await this.taskRepository.delete(id);
  }


  async taskFindMany(searchFormFields: SearchFormFields, pagerParams: PagerParams, sessionUser: SessionUser): Promise<[Task[], number]> {
    c.fs('TaskService > taskFindMany');
    const anyCondition = buildAnyCondition(searchFormFields);
    return await this.taskRepository.findMany(anyCondition, asc("title"), (pagerParams.pageIndex - 1) * pagerParams.pageSize, pagerParams.pageSize);
  }


  async taskFindById(id: string, sessionUser: SessionUser): Promise<Task | null> {
    c.fs('TaskService > taskFindById');
    c.d(String(id));
    return await this.taskRepository.findById(id);
  }


  async taskUpdate(id: string, task: Task, sessionUser: SessionUser): Promise<void> {
    c.fs('TaskService > taskUpdate');
    task.updatedAtUTC = new Date();
    task.updatedBy = sessionUser.id;

    await this.taskRepository.update(id, task);
  }

}
