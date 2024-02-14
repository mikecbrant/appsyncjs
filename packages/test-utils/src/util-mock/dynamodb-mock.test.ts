import { randomBytes } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import dynamodb from './dynamodb-mock.js';

const {
	fromS3ObjectJson,
	toBinary,
	toBinarySet,
	toBoolean,
	toDynamoDB,
	toList,
	toMap,
	toMapValues,
	toNull,
	toNumber,
	toNumberSet,
	toS3Object,
	toString,
	toStringSet,
} = dynamodb;

describe('dynamodb mock', () => {
	describe('fromS3ObjectJson', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(fromS3ObjectJson)).toBe(true);
		});

		it('works as expected with minimal fields', () => {
			const obj = {
				key: 'foo',
				bucket: 'bar',
			};
			const input = { S: JSON.stringify({ s3: obj }) };

			const result = fromS3ObjectJson(input);

			expect(result).toEqual(obj);
			expect(fromS3ObjectJson).toBeCalledWith(input);
		});

		it('works as expected with all fields', () => {
			const obj = {
				key: 'foo',
				bucket: 'bar',
				region: 'us-east-1',
				version: '1',
			};
			const input = { S: JSON.stringify({ s3: obj }) };

			const result = fromS3ObjectJson(input);

			expect(result).toEqual(obj);
			expect(fromS3ObjectJson).toBeCalledWith(input);
		});
	});

	describe('toBinary', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toBinary)).toBe(true);
		});

		it('works as expected', () => {
			const randBuffer = randomBytes(256);
			const base64 = randBuffer.toString('base64');

			const result = toBinary(base64);

			expect(result).toEqual({ B: base64 });
			expect(toBinary).toBeCalledWith(base64);
		});
	});

	describe('toBinarySet', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toBinarySet)).toBe(true);
		});

		it('works as expected', () => {
			const randBuffers = [
				randomBytes(256),
				randomBytes(256),
				randomBytes(256),
			];
			const base64Set = randBuffers.map((buf) => buf.toString('base64'));
			const result = toBinarySet(base64Set);

			expect(result).toEqual({ BS: base64Set });
			expect(toBinarySet).toBeCalledWith(base64Set);
		});
	});

	describe('toBoolean', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toBoolean)).toBe(true);
		});

		it('works for true', () => {
			const result = toBoolean(true);

			expect(result).toEqual({ BOOL: true });
			expect(toBoolean).toBeCalledWith(true);
		});

		it('works for false', () => {
			const result = toBoolean(false);

			expect(result).toEqual({ BOOL: false });
			expect(toBoolean).toBeCalledWith(false);
		});
	});

	describe('toDynamoDB', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toDynamoDB)).toBe(true);
		});

		it('works as expected', () => {
			const obj = {
				foo: 'bar',
				num: 123,
				nul: null,
				bool: true,
				arr: ['bat', 3.14, { fizz: 'buzz' }],
			};

			const result = toDynamoDB(obj);

			// note slightly different values here for N and NULL types
			expect(result).toEqual({
				M: {
					foo: { S: 'bar' },
					num: { N: 123 },
					nul: { NULL: null },
					bool: { BOOL: true },
					arr: {
						L: [
							{ S: 'bat' },
							{ N: 3.14 },
							{
								M: {
									fizz: { S: 'buzz' },
								},
							},
						],
					},
				},
			});
			expect(toDynamoDB).toBeCalledWith(obj);
		});
	});

	describe('toList', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toList)).toBe(true);
		});

		it('works as expected', () => {
			const arr = [
				'bar',
				123,
				null,
				true,
				['bat', 3.14, { fizz: 'buzz' }],
				{ foo: 'bar' },
			];

			const result = toList(arr);

			// note slightly different values here for N and NULL types
			expect(result).toEqual({
				L: [
					{ S: 'bar' },
					{ N: 123 },
					{ NULL: null },
					{ BOOL: true },
					{
						L: [
							{ S: 'bat' },
							{ N: 3.14 },
							{
								M: {
									fizz: { S: 'buzz' },
								},
							},
						],
					},
					{
						M: {
							foo: { S: 'bar' },
						},
					},
				],
			});
			expect(toList).toBeCalledWith(arr);
		});
	});

	describe('toMap', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toMap)).toBe(true);
		});

		it('works as expected', () => {
			const obj = {
				foo: 'bar',
				num: 123,
				nul: null,
				bool: true,
				arr: ['bat', 3.14, { fizz: 'buzz' }],
			};

			const result = toMap(obj);

			// note slightly different values here for N and NULL types
			expect(result).toEqual({
				M: {
					foo: { S: 'bar' },
					num: { N: 123 },
					nul: { NULL: null },
					bool: { BOOL: true },
					arr: {
						L: [
							{ S: 'bat' },
							{ N: 3.14 },
							{
								M: {
									fizz: { S: 'buzz' },
								},
							},
						],
					},
				},
			});
			expect(toMap).toBeCalledWith(obj);
		});
	});

	describe('toMapValues', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toMap)).toBe(true);
		});

		it('works as expected', () => {
			const obj = {
				foo: 'bar',
				num: 123,
				nul: null,
				bool: true,
				arr: ['bat', 3.14, { fizz: 'buzz' }],
			};

			const result = toMapValues(obj);

			// note slightly different values here for N and NULL types
			expect(result).toEqual({
				foo: { S: 'bar' },
				num: { N: 123 },
				nul: { NULL: null },
				bool: { BOOL: true },
				arr: {
					L: [
						{ S: 'bat' },
						{ N: 3.14 },
						{
							M: {
								fizz: { S: 'buzz' },
							},
						},
					],
				},
			});
			expect(toMapValues).toBeCalledWith(obj);
		});
	});

	describe('toNull', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toNull)).toBe(true);
		});

		it('works as expected', () => {
			const result = toNull();

			expect(result).toEqual({ NULL: null });
			expect(toNull).toBeCalled();
		});
	});

	describe('toNumber', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toNumber)).toBe(true);
		});

		it('works as expected', () => {
			const num = 3.14;
			const result = toNumber(num);

			expect(result).toEqual({ N: num });
			expect(toNumber).toBeCalledWith(num);
		});
	});

	describe('toNumberSet', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toNumberSet)).toBe(true);
		});

		it('works as expected', () => {
			const arr = [3.14, 42, 0];
			const result = toNumberSet(arr);

			expect(result).toEqual({ NS: arr });
			expect(toNumberSet).toBeCalledWith(arr);
		});
	});

	describe('toS3Object', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toS3Object)).toBe(true);
		});

		it('works as with minimum inputs', () => {
			const key = 'foo';
			const bucket = 'bar';
			const result = toS3Object(key, bucket);

			expect(result).toEqual({
				S: JSON.stringify({
					s3: {
						key,
						bucket,
					},
				}),
			});
			expect(toS3Object).toBeCalledWith(key, bucket);
		});

		it('works as with all inputs', () => {
			const key = 'foo';
			const bucket = 'bar';
			const region = 'us-east-1';
			const version = 1;
			const result = toS3Object(key, bucket, region, version);

			expect(result).toEqual({
				S: JSON.stringify({
					s3: {
						key,
						bucket,
						region,
						version,
					},
				}),
			});
			expect(toS3Object).toBeCalledWith(key, bucket, region, version);
		});
	});

	describe('toString', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toString)).toBe(true);
		});

		it('works as expected', () => {
			const str = 'foo';
			// @ts-expect-error ts thinks this is standard toString() method
			const result = toString(str);

			expect(result).toEqual({ S: str });
			expect(toString).toBeCalledWith(str);
		});
	});

	describe('toStringSet', () => {
		it('is a mock function', () => {
			expect(vi.isMockFunction(toStringSet)).toBe(true);
		});

		it('works as expected', () => {
			const arr = ['foo', 'bar', ''];
			const result = toStringSet(arr);

			expect(result).toEqual({ SS: arr });
			expect(toStringSet).toBeCalledWith(arr);
		});
	});
});
