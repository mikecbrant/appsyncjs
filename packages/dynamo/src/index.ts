import getItem from './get-item.js';
import { buildProjectionExpression } from './utils.js';

const Dynamo = {
	buildProjectionExpression,
	getItem,
};

export { Dynamo as default, buildProjectionExpression, getItem };
