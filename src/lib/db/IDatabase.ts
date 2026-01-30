
// export type IDBType = MySql2Database<typeof schema>;
// export type ITransactionType = Parameters<Parameters<IDBType['transaction']>[0]>[0];

export abstract class IDatabaseClient<T> {
    abstract get db(): T ;
}

export const IDatabaseRuntime = {};
