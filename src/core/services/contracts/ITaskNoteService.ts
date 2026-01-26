import SessionUser from "../../models/dto/SessionUser";
import TaskNote from "../../models/domain/TaskNote";

export default interface ITaskNoteService {
  taskNoteCreate(taskNote: TaskNote, sessionUser: SessionUser): Promise<TaskNote>;
  taskNoteFindMany(taskId: string, sessionUser: SessionUser): Promise<TaskNote[]>;
}
