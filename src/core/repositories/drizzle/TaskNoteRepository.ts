import { injectable, inject } from "inversify";
import { Repository } from "../../../lib/repositories/drizzle/Repository";
import TaskNote from "@/core/models/domain/TaskNote";
import TaskNoteEntity from "@/core/models/entity/TaskNoteEntity";
import { taskNoteTable } from "@/core/orms/drizzle/mysql/schema";
import type ITaskNoteRepository from "../contracts/ITaskNoteRepository";
import { TYPES } from "@/core/types";
import type { IDatabaseClient } from "@/lib/db/IDatabase";
import type IMapper from "@/lib/mappers/IMapper";
import type IQueryTranformer from "@/lib/transformers/IQueryTransformer";
import { eq, desc } from "drizzle-orm";

@injectable()
export default class TaskNoteRepository extends Repository<TaskNote, TaskNoteEntity, typeof taskNoteTable> implements ITaskNoteRepository {
    constructor(
        @inject(TYPES.IDatabase) protected readonly dbClient: IDatabaseClient<any>,
        @inject(TYPES.IMapper) protected readonly mapper: IMapper,
        @inject(TYPES.IQueryTransformer) protected readonly transformer: IQueryTranformer
    ) {
        super(dbClient, taskNoteTable, { ...taskNoteTable }, (q) => q, mapper, TaskNote, TaskNoteEntity, transformer);
    }

    async getByTaskId(taskId: string): Promise<TaskNote[]> {
        const entities = await this.dbClient.db.select()
            .from(taskNoteTable)
            .where(eq(taskNoteTable.taskId, taskId))
            .orderBy(desc(taskNoteTable.createdAtUTC));
        return entities.map((e: any) => this.mapper.map(e, TaskNoteEntity, TaskNote));
    }
}
