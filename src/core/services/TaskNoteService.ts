import { injectable, inject } from "inversify";
import { BaseService } from "./BaseService";
import TaskNote from "@/core/models/domain/TaskNote";
import type ITaskNoteRepository from "@/core/repositories/contracts/ITaskNoteRepository";
import ITaskNoteService from "./contracts/ITaskNoteService";
import { TYPES } from "@/core/types";

@injectable()
export default class TaskNoteService extends BaseService<TaskNote> implements ITaskNoteService {
    constructor(
        @inject(TYPES.ITaskNoteRepository) protected readonly repository: ITaskNoteRepository
    ) {
        super(repository);
    }

    async getByTaskId(taskId: string): Promise<TaskNote[]> {
        return this.repository.getByTaskId(taskId);
    }
}
