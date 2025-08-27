import { describe, expect, it } from 'vitest';
import Dynamo, { buildProjectionExpression, getItem, deleteItem, updateItem } from './index.js';

describe('index', () => {
	it('has expected exports', () => {
		[buildProjectionExpression, getItem, deleteItem, updateItem].forEach((exp) => {
			expect(exp).toBeTypeOf('function');
			const name = exp.name;
			expect(Dynamo[name]).toStrictEqual(exp);
		});
	});
});
