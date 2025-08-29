# @mikecbrant/create-appsyncjs

Create a new repository scaffold for an AWS AppSync application using SST v3 (Pulumi), with DynamoDB and example User CRUD resolvers.

## Usage

With pnpm (recommended):

```bash
pnpm dlx @mikecbrant/create-appsyncjs my-app
```

With npm:

```bash
npm create @mikecbrant/create-appsyncjs@latest my-app
# or
npx @mikecbrant/create-appsyncjs my-app
```

This will generate a new project in `my-app/`.

Flags to run non-interactively:

```
--entity, -e        Entity name (singular, PascalCase)
--description, -d   Project description for package.json
```

During interactive generation you'll be prompted for:

- Entity name (singular, PascalCase). Default: `User`.
- Project description to place in `package.json`.

## What it generates

- SST v3 config provisioning an AppSync GraphQL API and a DynamoDB table (via Pulumi)
- GraphQL schema and AppSync JS resolvers for a basic entity (get/put/update/delete)
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
await create({
	templateDir: '/path/to/pkg/scaffold',
	dest: './my-app',
	entity: 'User',
	description: 'My AppSync + DynamoDB starter',
});
```

## Requirements and defaults

- Node.js >= 22 (both generator and generated project)
- Default AWS region: `us-east-1`
- Testing/tooling: Vitest; scripts align with `create-sst` (`sst load-config -- vitest run`)
- Authentication: default is an API key (no user pool).

The scaffold keeps dependencies current at generation time and pins `@mikecbrant/appsyncjs-*` to the latest versions available when you run the generator.
