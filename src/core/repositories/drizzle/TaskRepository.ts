import { injectable, inject } from "inversify";
import { Repository } from "../../../lib/repositories/drizzle/Repository";
import Task from "@/core/models/domain/Task";
import TaskEntity from "@/core/models/entity/TaskEntity";
import { taskTable } from "@/core/orms/drizzle/mysql/schema";
import type ITaskRepository from "../contracts/ITaskRepository";
import { TYPES } from "@/core/types";
import type { IDatabaseClient } from "@/lib/db/IDatabase";
import type IMapper from "@/lib/mappers/IMapper";
import type IQueryTranformer from "@/lib/transformers/IQueryTransformer";

@injectable()
export default class TaskRepository extends Repository<Task, TaskEntity, typeof taskTable> implements ITaskRepository {
    constructor(
        @inject(TYPES.IDatabase) protected readonly dbClient: IDatabaseClient<any>,
        @inject(TYPES.IMapper) protected readonly mapper: IMapper,
        @inject(TYPES.IQueryTransformer) protected readonly transformer: IQueryTranformer
    ) {
        super(dbClient, taskTable, { ...taskTable }, (q) => q, mapper, Task, TaskEntity, transformer);
    }
}
