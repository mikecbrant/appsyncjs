import getItem from './get-item.js';
import deleteItem from './delete-item.js';
import putItem from './put-item.js';
import updateItem from './update-item.js';
import { buildProjectionExpression } from './utils.js';

export type { PutItemProps } from './put-item.js';

const Dynamo = {
	buildProjectionExpression,
	getItem,
	putItem,
	deleteItem,
	updateItem,
};

export {
	Dynamo as default,
	buildProjectionExpression,
	getItem,
	putItem,
	deleteItem,
	updateItem,
};

// Re-export common types and helper prop types for consumers
export type { DynamoKey, DynamoKeyField } from './types.js';
export type { GetItemProps } from './get-item.js';
export type { DeleteItemProps } from './delete-item.js';
