# @mikecbrant/appsyncjs-dynamo

## 0.3.0

### Minor Changes

- 1623c34: feat(dynamo): add `deleteItem` helper and export helper prop types
  - New `deleteItem(props)` builds a valid DynamoDBDeleteItemRequest (no delta sync options included).
  - Public API now exports `deleteItem` alongside existing helpers.
  - Exported types include `GetItemProps`, `DeleteItemProps`, and common `DynamoKey` types.
  - Updated package README with usage examples and API notes.

## 0.2.0

### Minor Changes

- c9632b2: Add a typed `updateItem` utility and export it on the public surface of `@mikecbrant/appsyncjs-dynamo`.

  Refs PR #10, MIK-11.

## 0.1.0

### Minor Changes

- dd33dfc: Add `putItem(props)` helper for building `DynamoDBPutItemRequest` and export `PutItemProps` from the public API for typed consumption.

## 0.0.1

### Patch Changes

- 0cb8c75: chore(deps): update dependency/devDependency specifiers to latest non‑major ranges. No runtime code changes.
