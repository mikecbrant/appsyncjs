import { describe, expect, it } from 'vitest';
<<<<<<< HEAD
import Dynamo, {
	buildProjectionExpression,
	getItem,
	putItem,
	deleteItem,
	updateItem,
} from './index.js';

describe('index', () => {
	it('has expected exports', () => {
		[buildProjectionExpression, getItem, putItem, deleteItem, updateItem].forEach((exp) => {
=======
import Dynamo, { buildProjectionExpression, getItem, putItem, updateItem } from './index.js';

describe('index', () => {
	it('has expected exports', () => {
		[buildProjectionExpression, getItem, putItem, updateItem].forEach((exp) => {
>>>>>>> origin/main
			expect(exp).toBeTypeOf('function');
			const name = exp.name;
			expect(Dynamo[name]).toStrictEqual(exp);
		});
	});
});
