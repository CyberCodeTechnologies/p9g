import TaskNote from "@/core/models/domain/TaskNote";
import IRepository from "./IRepository";

export default interface ITaskNoteRepository extends IRepository<TaskNote> {
    getByTaskId(taskId: string): Promise<TaskNote[]>;
}
