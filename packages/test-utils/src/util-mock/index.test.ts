import { describe, expect, it } from 'vitest';
import { appendError, error } from './errors.js';
import { autoKsuid, autoUlid, autoUuid } from './ids.js';
import dynamodb from './dynamodb-mock.ts';
import time from './time.js';
import utilMock from './index.js';

describe('utilMock', () => {
	it('has expected exports', () => {
		expect(utilMock.appendError).toStrictEqual(appendError);
		expect(utilMock.autoKsuid).toStrictEqual(autoKsuid);
		expect(utilMock.autoUlid).toStrictEqual(autoUlid);
		expect(utilMock.autoUuid).toStrictEqual(autoUuid);
		expect(utilMock.dynamodb).toStrictEqual(dynamodb);
		expect(utilMock.error).toStrictEqual(error);
		expect(utilMock.time).toStrictEqual(time);
	});
});
