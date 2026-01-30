import Task from "@/core/models/domain/Task";
import IRepository from "./IRepository";

export default interface ITaskRepository extends IRepository<Task> {
}
