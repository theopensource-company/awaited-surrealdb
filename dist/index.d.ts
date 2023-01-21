import Surreal, { Auth, Patch, Result } from "surrealdb.js";
type TokenInput = string | undefined | null | void;
export default class AwaitedSurreal {
    readonly endpoint: string;
    readonly instance: Surreal;
    private queue;
    constructor({ endpoint, namespace, database, token, initialAuthSuccess, initialAuthFailed, }: {
        endpoint: string;
        namespace: string;
        database: string;
        token?: TokenInput | (() => Promise<TokenInput>);
        initialAuthSuccess?: () => unknown;
        initialAuthFailed?: (e: any) => unknown;
    });
    waitForConnection(): Promise<true>;
    /**
     * Switch to a specific namespace and database.
     * @param ns - Switches to a specific namespace.
     * @param db - Switches to a specific database.
     */
    use(ns: string, db: string): Promise<void>;
    /**
     * Signs up to a specific authentication scope.
     * @param vars - Variables used in a signup query.
     * @return The authenication token.
     */
    signup(vars: Auth): Promise<string>;
    /**
     * Signs in to a specific authentication scope.
     * @param vars - Variables used in a signin query.
     * @return The authenication token.
     */
    signin(vars: Auth): Promise<string>;
    /**
     * Invalidates the authentication for the current connection.
     */
    invalidate(): Promise<void>;
    /**
     * Authenticates the current connection with a JWT token.
     * @param token - The JWT authentication token.
     */
    authenticate(token: string): Promise<void>;
    live(table: string): Promise<string>;
    /**
     * Kill a specific query.
     * @param query - The query to kill.
     */
    kill(query: string): Promise<void>;
    /**
     * Define a variable for the current session.
     * @param key - Specifies the name of the variable.
     * @param val - Assigns the value to the variable name.
     */
    let(key: string, val: unknown): Promise<string>;
    /**
     * Runs a set of SurrealQL statements against the database.
     * @param query - Specifies the SurrealQL statements.
     * @param vars - Assigns variables which can be used in the query.
     */
    query<T = Result[]>(query: string, vars?: Record<string, unknown>): Promise<T>;
    /**
     * Runs a set of SurrealQL statements against the database. Typing for this function is opiniated.
     * @param query - Specifies the SurrealQL statements.
     * @param vars - Assigns variables which can be used in the query.
     */
    opiniatedQuery<T = unknown>(query: string, vars?: Record<string, unknown>): Promise<Result<T[]>[]>;
    /**
     * Selects all records in a table, or a specific record, from the database.
     * @param thing - The table name or a record ID to select.
     */
    select<T>(thing: string): Promise<T[]>;
    /**
     * Creates a record in the database.
     * @param thing - The table name or the specific record ID to create.
     * @param data - The document / record data to insert.
     */
    create<T extends Record<string, unknown>>(thing: string, data?: T): Promise<T & {
        id: string;
    }>;
    /**
     * Updates all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function replaces the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to update.
     * @param data - The document / record data to insert.
     */
    update<T extends Record<string, unknown>>(thing: string, data?: T): Promise<T & {
        id: string;
    }>;
    /**
     * Modifies all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function merges the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to change.
     * @param data - The document / record data to insert.
     */
    change<T extends Record<string, unknown>, U extends Record<string, unknown> = T>(thing: string, data?: Partial<T> & U): Promise<(T & U & {
        id: string;
    }) | (T & U & {
        id: string;
    })[]>;
    /**
     * Applies JSON Patch changes to all records, or a specific record, in the database.
     *
     * ***NOTE: This function patches the current document / record data with the specified JSON Patch data.***
     * @param thing - The table name or the specific record ID to modify.
     * @param data - The JSON Patch data with which to modify the records.
     */
    modify(thing: string, data?: Patch[]): Promise<Patch[]>;
    /**
     * Deletes all records in a table, or a specific record, from the database.
     * @param thing - The table name or a record ID to select.
     */
    delete(thing: string): Promise<void>;
}
export {};
