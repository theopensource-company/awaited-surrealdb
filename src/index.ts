import Surreal, { Auth, Patch, Result } from "surrealdb.js";

type TokenInput = string | undefined | null | void;

export default class AwaitedSurreal {
  public readonly endpoint: string;
  public readonly instance: Surreal;
  private queue: Promise<unknown>[] = [];

  public constructor({
    endpoint,
    namespace,
    database,
    token,
    initialAuthSuccess,
    initialAuthFailed,
  }: {
    endpoint: string;
    namespace: string;
    database: string;
    token?: TokenInput | (() => Promise<TokenInput>);
    initialAuthSuccess?: () => unknown;
    initialAuthFailed?: (e: any) => unknown;
  }) {
    this.endpoint = new URL(endpoint).origin;
    const instance = new Surreal(`${this.endpoint}/rpc`);
    this.instance = instance;
    this.queue.push(
      (async () => {
        await instance.use(namespace, database);
        token = typeof token == "function" ? await token() : token;
        if (token)
          await instance
            .authenticate(token)
            .then(() => initialAuthSuccess?.())
            .catch((e) => {
              console.log("Failed to authenticate user with provided token");
              initialAuthFailed?.(e);
            });
      })()
    );
  }

  public async waitForConnection(): Promise<true> {
    await Promise.allSettled(this.queue);
    return true;
  }

  /**
   * Switch to a specific namespace and database.
   * @param ns - Switches to a specific namespace.
   * @param db - Switches to a specific database.
   */
  public async use(ns: string, db: string): Promise<void> {
    await this.waitForConnection();
    const task = this.instance.use(ns, db);
    this.queue.push(task);
    return task;
  }

  /**
   * Signs up to a specific authentication scope.
   * @param vars - Variables used in a signup query.
   * @return The authenication token.
   */
  public async signup(vars: Auth): Promise<string> {
    await this.waitForConnection();
    const task = this.instance.signup(vars);
    this.queue.push(task);
    return task;
  }

  /**
   * Signs in to a specific authentication scope.
   * @param vars - Variables used in a signin query.
   * @return The authenication token.
   */
  public async signin(vars: Auth): Promise<string> {
    await this.waitForConnection();
    const task = this.instance.signin(vars);
    this.queue.push(task);
    return task;
  }

  /**
   * Invalidates the authentication for the current connection.
   */
  public async invalidate(): Promise<void> {
    await this.waitForConnection();
    const task = this.instance.invalidate();
    this.queue.push(task);
    return task;
  }

  /**
   * Authenticates the current connection with a JWT token.
   * @param token - The JWT authentication token.
   */
  public async authenticate(token: string): Promise<void> {
    await this.waitForConnection();
    const task = this.instance.authenticate(token);
    this.queue.push(task);
    return task;
  }

  public async live(table: string): Promise<string> {
    await this.waitForConnection();
    return this.instance.live(table);
  }

  /**
   * Kill a specific query.
   * @param query - The query to kill.
   */
  public async kill(query: string): Promise<void> {
    await this.waitForConnection();
    return this.instance.kill(query);
  }

  /**
   * Define a variable for the current session.
   * @param key - Specifies the name of the variable.
   * @param val - Assigns the value to the variable name.
   */
  public async let(key: string, val: unknown): Promise<string> {
    await this.waitForConnection();
    return this.instance.let(key, val);
  }

  /**
   * Runs a set of SurrealQL statements against the database.
   * @param query - Specifies the SurrealQL statements.
   * @param vars - Assigns variables which can be used in the query.
   */
  public async query<T = Result[]>(
    query: string,
    vars?: Record<string, unknown>
  ): Promise<T> {
    await this.waitForConnection();
    return this.instance.query<T>(query, vars);
  }

  /**
   * Runs a set of SurrealQL statements against the database. Typing for this function is opiniated.
   * @param query - Specifies the SurrealQL statements.
   * @param vars - Assigns variables which can be used in the query.
   */
  public async opiniatedQuery<T = unknown>(
    query: string,
    vars?: Record<string, unknown>
  ): Promise<Result<T[]>[]> {
    await this.waitForConnection();
    return this.instance.query<Result<T[]>[]>(query, vars);
  }

  /**
   * Selects all records in a table, or a specific record, from the database.
   * @param thing - The table name or a record ID to select.
   */
  public async select<T>(thing: string): Promise<T[]> {
    await this.waitForConnection();
    return this.instance.select<T>(thing);
  }

  /**
   * Creates a record in the database.
   * @param thing - The table name or the specific record ID to create.
   * @param data - The document / record data to insert.
   */
  public async create<T extends Record<string, unknown>>(
    thing: string,
    data?: T
  ): Promise<
    T & {
      id: string;
    }
  > {
    await this.waitForConnection();
    return this.instance.create<T>(thing, data);
  }

  /**
   * Updates all records in a table, or a specific record, in the database.
   *
   * ***NOTE: This function replaces the current document / record data with the specified data.***
   * @param thing - The table name or the specific record ID to update.
   * @param data - The document / record data to insert.
   */
  public async update<T extends Record<string, unknown>>(
    thing: string,
    data?: T
  ): Promise<
    T & {
      id: string;
    }
  > {
    await this.waitForConnection();
    return this.instance.update<T>(thing, data);
  }

  /**
   * Modifies all records in a table, or a specific record, in the database.
   *
   * ***NOTE: This function merges the current document / record data with the specified data.***
   * @param thing - The table name or the specific record ID to change.
   * @param data - The document / record data to insert.
   */
  public async change<
    T extends Record<string, unknown>,
    U extends Record<string, unknown> = T
  >(
    thing: string,
    data?: Partial<T> & U
  ): Promise<
    | (T &
        U & {
          id: string;
        })
    | (T &
        U & {
          id: string;
        })[]
  > {
    await this.waitForConnection();
    return this.instance.change<T, U>(thing, data);
  }

  /**
   * Applies JSON Patch changes to all records, or a specific record, in the database.
   *
   * ***NOTE: This function patches the current document / record data with the specified JSON Patch data.***
   * @param thing - The table name or the specific record ID to modify.
   * @param data - The JSON Patch data with which to modify the records.
   */
  public async modify(thing: string, data?: Patch[]): Promise<Patch[]> {
    await this.waitForConnection();
    return this.instance.modify(thing, data);
  }

  /**
   * Deletes all records in a table, or a specific record, from the database.
   * @param thing - The table name or a record ID to select.
   */
  public async delete(thing: string): Promise<void> {
    await this.waitForConnection();
    return this.instance.delete(thing);
  }
}
