import getItem from './get-item.js';
import putItem from './put-item.js';
import updateItem from './update-item.js';
import { buildProjectionExpression } from './utils.js';
export type { PutItemProps } from './put-item.js';

const Dynamo = {
	buildProjectionExpression,
	getItem,
	putItem,
	updateItem,
};

export { Dynamo as default, buildProjectionExpression, getItem, putItem, updateItem };
