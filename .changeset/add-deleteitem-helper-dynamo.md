---
'@mikecbrant/appsyncjs-dynamo': minor
---

feat(dynamo): add `deleteItem` helper and export helper prop types

- New `deleteItem(props)` builds a valid DynamoDBDeleteItemRequest (no delta sync options included).
- Public API now exports `deleteItem` alongside existing helpers.
- Exported types include `GetItemProps`, `DeleteItemProps`, and common `DynamoKey` types.
- Updated package README with usage examples and API notes.
