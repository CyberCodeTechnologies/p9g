import TaskNote from "@/core/models/domain/TaskNote";
import type IBaseService from "./IBaseService";

export default interface ITaskNoteService extends IBaseService<TaskNote> {
    getByTaskId(taskId: string): Promise<TaskNote[]>;
}
