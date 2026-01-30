import { injectable, inject } from "inversify";
import { BaseService } from "./BaseService";
import Task from "@/core/models/domain/Task";
import type ITaskRepository from "@/core/repositories/contracts/ITaskRepository";
import ITaskService from "./contracts/ITaskService";
import { TYPES } from "@/core/types";
import { AnyCondition, and } from "@/lib/transformers/types";

@injectable()
export default class TaskService extends BaseService<Task> implements ITaskService {
    constructor(
        @inject(TYPES.ITaskRepository) protected readonly repository: ITaskRepository
    ) {
        super(repository);
    }

    async create(task: Task): Promise<Task> {
        return await this.repository.create(task);
    }

    async getById(id: string): Promise<Task | null> {
        return await this.repository.findById(id);
    }

    async update(task: Task): Promise<void> {
        if (!task.id) throw new Error("Task ID is required for update");

        if (task.status === 'Closed' && !task.completedDate) {
            task.completedDate = new Date();
        } else if (task.status !== 'Closed') {
            task.completedDate = null;
        }

        await this.repository.update(task.id, task);
    }

    async getByComplexConditions(conditions: AnyCondition[]): Promise<Task[]> {
        let query: AnyCondition | undefined;
        if (conditions.length === 1) {
            query = conditions[0];
        } else if (conditions.length > 1) {
            query = and(...conditions);
        }
        
        const [tasks, count] = await this.repository.findMany(query);
        return tasks;
    }
}
