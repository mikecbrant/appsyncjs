import { describe, expect, it } from 'vitest';
import Dynamo, {
	buildKeyCondition,
	buildProjectionExpression,
	deleteItem,
	getItem,
	putItem,
} from './index.js';

describe('index', () => {
	it('has expected exports', () => {
		[
			buildKeyCondition,
			buildProjectionExpression,
			deleteItem,
			getItem,
			putItem,
		].forEach((exp) => {
			expect(exp).toBeTypeOf('function');
			const name = exp.name;
			expect(Dynamo[name]).toStrictEqual(exp);
		});
	});
});
