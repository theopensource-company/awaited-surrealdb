import Surreal from "surrealdb.js";
export default class AwaitedSurreal {
    constructor({ endpoint, namespace, database, token, initialAuthSuccess, initialAuthFailed, }) {
        this.queue = [];
        this.endpoint = new URL(endpoint).origin;
        const instance = new Surreal(`${this.endpoint}/rpc`);
        this.instance = instance;
        this.queue.push((async () => {
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
        })());
    }
    async waitForConnection() {
        await Promise.allSettled(this.queue);
        return true;
    }
    /**
     * Switch to a specific namespace and database.
     * @param ns - Switches to a specific namespace.
     * @param db - Switches to a specific database.
     */
    async use(ns, db) {
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
    async signup(vars) {
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
    async signin(vars) {
        await this.waitForConnection();
        const task = this.instance.signin(vars);
        this.queue.push(task);
        return task;
    }
    /**
     * Invalidates the authentication for the current connection.
     */
    async invalidate() {
        await this.waitForConnection();
        const task = this.instance.invalidate();
        this.queue.push(task);
        return task;
    }
    /**
     * Authenticates the current connection with a JWT token.
     * @param token - The JWT authentication token.
     */
    async authenticate(token) {
        await this.waitForConnection();
        const task = this.instance.authenticate(token);
        this.queue.push(task);
        return task;
    }
    async live(table) {
        await this.waitForConnection();
        return this.instance.live(table);
    }
    /**
     * Kill a specific query.
     * @param query - The query to kill.
     */
    async kill(query) {
        await this.waitForConnection();
        return this.instance.kill(query);
    }
    /**
     * Define a variable for the current session.
     * @param key - Specifies the name of the variable.
     * @param val - Assigns the value to the variable name.
     */
    async let(key, val) {
        await this.waitForConnection();
        return this.instance.let(key, val);
    }
    /**
     * Runs a set of SurrealQL statements against the database.
     * @param query - Specifies the SurrealQL statements.
     * @param vars - Assigns variables which can be used in the query.
     */
    async query(query, vars) {
        await this.waitForConnection();
        return this.instance.query(query, vars);
    }
    /**
     * Runs a set of SurrealQL statements against the database. Typing for this function is opiniated.
     * @param query - Specifies the SurrealQL statements.
     * @param vars - Assigns variables which can be used in the query.
     */
    async opiniatedQuery(query, vars) {
        await this.waitForConnection();
        return this.instance.query(query, vars);
    }
    /**
     * Selects all records in a table, or a specific record, from the database.
     * @param thing - The table name or a record ID to select.
     */
    async select(thing) {
        await this.waitForConnection();
        return this.instance.select(thing);
    }
    /**
     * Creates a record in the database.
     * @param thing - The table name or the specific record ID to create.
     * @param data - The document / record data to insert.
     */
    async create(thing, data) {
        await this.waitForConnection();
        return this.instance.create(thing, data);
    }
    /**
     * Updates all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function replaces the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to update.
     * @param data - The document / record data to insert.
     */
    async update(thing, data) {
        await this.waitForConnection();
        return this.instance.update(thing, data);
    }
    /**
     * Modifies all records in a table, or a specific record, in the database.
     *
     * ***NOTE: This function merges the current document / record data with the specified data.***
     * @param thing - The table name or the specific record ID to change.
     * @param data - The document / record data to insert.
     */
    async change(thing, data) {
        await this.waitForConnection();
        return this.instance.change(thing, data);
    }
    /**
     * Applies JSON Patch changes to all records, or a specific record, in the database.
     *
     * ***NOTE: This function patches the current document / record data with the specified JSON Patch data.***
     * @param thing - The table name or the specific record ID to modify.
     * @param data - The JSON Patch data with which to modify the records.
     */
    async modify(thing, data) {
        await this.waitForConnection();
        return this.instance.modify(thing, data);
    }
    /**
     * Deletes all records in a table, or a specific record, from the database.
     * @param thing - The table name or a record ID to select.
     */
    async delete(thing) {
        await this.waitForConnection();
        return this.instance.delete(thing);
    }
}
