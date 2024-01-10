# ⚠️ NOT MAINTAINED ⚠️

The problem this library solved is now available within the `surrealdb.js` package itself, with the `prepare` function you can pass to it's `.connect()` method. Please use that library instead!

# awaited-surrealdb

This library makes sure to connect & authenticate to your surrealdb database before you execute any query. You can then go on to, for example, make some calls to the database via tanstack query or similar. 

## Motivation
I don't nesicarrily want to create a full blown react library, as it will likely be very opiniated. Instead, this wrapper library solves a basic issue: The initiation of the surrealdb.js library.

It does so by storing an async init function being executed in a queue, or whenever you change scope / authentication. Every function has then been wrapped in a way that it will make sure that all promises in the queue have at some point been resolved. 

This way you have the best of both world :D

## Example

```typescript
import AwaitedSurreal from '@theopensource-company/awaited-surrealdb';

const SurrealInstance = new AwaitedSurreal({
    endpoint: "http://localhost:8000",
    namespace: "test",
    database: "test",
    token: "..."
    // OR
    token: async function() {
        // Retrieve token from local storage for example
        return "...";
    }
});

export { SurrealInstance };
```

You can then interface with the instance just like the official surreal.js library, with the difference that it will wait before executing for the instance to set the namespace and authentication token.

Basic example of a user fetching function, using the opiniated query function (types are a little easier here when all the records are the same...)

```typescript
import { SurrealInstance } from '...';

type User = {
    id: `user:${string}`;
    name: string;
    username: string;
    picture?: string;
    created: Date;
};

async function fetchUsers(): Promise<User[] | void> {
    const raw = await SurrealInstance.opiniatedQuery<User>("SELECT * FROM user ORDER BY created DESC");
    if (!raw?.[0]?.result) return;
    return raw.map(u => ({
        ...raw,
        // Surreal will return a date string that JS in the browser understands.
        // You can easily parse it this way. No type conflict in this case because date objects also accept dates :)
        created: new Date(raw.created)
    }));
}
```
