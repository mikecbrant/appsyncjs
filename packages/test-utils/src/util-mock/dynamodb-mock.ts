import type { JsonArray, JsonObject, JsonValue } from 'type-fest';
import { type Mock, vi } from 'vitest';

type BinaryAttribute = { B: string };

type BinarySetAttribute = { BS: string[] };

type BooleanAttribute = { BOOL: boolean };

type ListAttribute = { L: ListAndMapValueAttributes[] };

type MapAttribute = { M: Record<string, ListAndMapValueAttributes> };

type NullAttribute = { NULL: null };

type NumberAttribute = { N: number };

type NumberSetAttribute = { NS: number[] };

type StringAttribute = { S: string };

type StringSetAttribute = { SS: string[] };

type ListAndMapValueAttributes =
	| BooleanAttribute
	| ListAttribute
	| MapAttribute
	| NullAttribute
	| NumberAttribute
	| StringAttribute;

const convert = (val: JsonValue): ListAndMapValueAttributes => {
	if (val === null) {
		return toNullImplementation();
	}
	if (val === true || val === false) {
		return toBooleanImplementation(val);
	}
	if (typeof val === 'string') {
		return toStringImplementation(val);
	}
	if (typeof val === 'number') {
		return toNumberImplementation(val);
	}
	if (Array.isArray(val)) {
		return toListImplementation(val);
	}
	return toMapImplementation(val as JsonObject);
};

type S3Object = {
	key: string;
	bucket: string;
	region?: string;
	version?: string;
};

const fromS3ObjectJsonImplentation = (
	s3Native: Record<'S', string>,
): S3Object => {
	const { s3 } = JSON.parse(s3Native.S);
	return s3;
};

const fromS3ObjectJson = vi.fn(fromS3ObjectJsonImplentation);

const toBinaryImplementation = (base64: string): BinaryAttribute => ({
	B: base64,
});

const toBinary = vi.fn(toBinaryImplementation);

const toBinarySetImplementation = (
	base64Arr: string[],
): BinarySetAttribute => ({ BS: base64Arr });

const toBinarySet = vi.fn(toBinarySetImplementation);

const toBooleanImplementation = (bool: boolean): BooleanAttribute => ({
	BOOL: bool,
});

const toBoolean = vi.fn(toBooleanImplementation);

const toDynamoDBImplementation = (val: JsonValue): ListAndMapValueAttributes =>
	convert(val);

const toDynamoDB = vi.fn(toDynamoDBImplementation);

const toListImplementation = (arr: JsonArray): ListAttribute => ({
	L: arr.map(convert),
});

const toList = vi.fn(toListImplementation);

const toMapImplementation = (pojo: JsonObject): MapAttribute => ({
	M: Object.fromEntries(
		Object.entries(pojo).map(([key, value]) => [key, convert(value)]),
	),
});

const toMap = vi.fn(toMapImplementation);

const toMapValuesImplementation = (pojo: JsonObject): MapAttribute['M'] =>
	toMapImplementation(pojo).M;

const toMapValues = vi.fn(toMapValuesImplementation);

const toNullImplementation = (): NullAttribute => ({ NULL: null });

const toNull = vi.fn(toNullImplementation);

const toNumberImplementation = (num: number): NumberAttribute => ({ N: num });

const toNumber = vi.fn(toNumberImplementation);

const toNumberSetImpementation = (arr: number[]): NumberSetAttribute => ({
	NS: arr,
});

const toNumberSet = vi.fn(toNumberSetImpementation);

const toS3ObjectImplementation = (
	key: string,
	bucket: string,
	region?: string,
	version?: string,
): StringAttribute =>
	toStringImplementation(
		JSON.stringify({ s3: { key, bucket, region, version } }),
	);

const toS3Object = vi.fn(toS3ObjectImplementation);

const toStringImplementation = (str: string): StringAttribute => ({ S: str });

const toString = vi.fn(toStringImplementation);

const toStringSetImplementation = (arr: string[]): StringSetAttribute => ({
	SS: arr,
});

const toStringSet = vi.fn(toStringSetImplementation);

const dynamodb: Record<string, Mock> = {
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
};

export { dynamodb as default };
