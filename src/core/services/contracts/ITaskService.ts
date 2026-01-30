import type IBaseService from "./IBaseService";
import Task from "@/core/models/domain/Task";
import { AnyCondition } from "@/lib/transformers/types";

export default interface ITaskService extends IBaseService<Task> {
    getByComplexConditions(conditions: AnyCondition[]): Promise<Task[]>;
    create(task: Task): Promise<Task>;
    getById(id: string): Promise<Task | null>;
    update(task: Task): Promise<void>;
}
