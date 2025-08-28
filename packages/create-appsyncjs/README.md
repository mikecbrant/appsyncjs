# @mikecbrant/create-appsyncjs

Create a new repository scaffold for an AWS AppSync application using SST, with DynamoDB and example User CRUD resolvers.

## Usage

With pnpm (recommended):

```bash
pnpm dlx @mikecbrant/create-appsyncjs my-app
```

With npm:

```bash
npm create @mikecbrant/appsyncjs@latest my-app
# or
npx @mikecbrant/create-appsyncjs my-app
```

This will generate a new project in `my-app/`.

## What it generates

- SST stack provisioning an AppSync GraphQL API and a DynamoDB table
- GraphQL schema and AppSync JS resolvers for a basic `User` entity (get/put/update/delete)
- Resolvers authored in TypeScript that use `@mikecbrant/appsyncjs-dynamo`
- Tests using `@mikecbrant/appsyncjs-test-utils` to mock the AppSync `util` API

## After generation

```bash
cd my-app
pnpm i
pnpm build:resolvers
pnpm test
pnpm deploy  # requires AWS credentials
```

## Programmatic API

```js
import { create } from '@mikecbrant/create-appsyncjs';
await create({ templateDir: '/path/to/pkg/scaffold', dest: './my-app' });
```
