import deleteItem from './delete-item.js';
import getItem from './get-item.js';
import putItem from './put-item.js';
import { buildKeyCondition, buildProjectionExpression } from './utils.js';

const Dynamo = {
	buildKeyCondition,
	buildProjectionExpression,
	deleteItem,
	getItem,
	putItem,
};

export {
	Dynamo as default,
	buildKeyCondition,
	buildProjectionExpression,
	deleteItem,
	getItem,
	putItem,
};
