import getItem from './get-item.js';
import putItem from './put-item.js';
import { buildProjectionExpression } from './utils.js';

const Dynamo = {
	buildProjectionExpression,
	getItem,
	putItem,
};

export { Dynamo as default, buildProjectionExpression, getItem, putItem };
