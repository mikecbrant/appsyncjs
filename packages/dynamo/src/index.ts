import getItem from './get-item.js';
import updateItem from './update-item.js';
import { buildProjectionExpression } from './utils.js';

const Dynamo = {
	buildProjectionExpression,
	getItem,
	updateItem,
};

export { Dynamo as default, buildProjectionExpression, getItem, updateItem };
