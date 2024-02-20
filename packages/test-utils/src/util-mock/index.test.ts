import { describe, expect, it } from 'vitest';
import { appendError, error } from './errors.js';
import { authType } from './type-and-pattern-matching.js';
import { autoKsuid, autoUlid, autoUuid } from './ids.js';
import {
	base64Decode,
	base64Encode,
	urlDecode,
	urlEncode,
} from './encoding.js';
import dynamodb from './dynamodb-mock.js';
import runtime from './runtime.js';
import time from './time.js';
import { unauthorized } from './authorization.js';
import utilMock from './index.js';

describe('utilMock', () => {
	it('has expected exports', () => {
		expect(utilMock.appendError).toStrictEqual(appendError);
		expect(utilMock.authType).toStrictEqual(authType);
		expect(utilMock.autoKsuid).toStrictEqual(autoKsuid);
		expect(utilMock.autoUlid).toStrictEqual(autoUlid);
		expect(utilMock.autoUuid).toStrictEqual(autoUuid);
		expect(utilMock.base64Decode).toStrictEqual(base64Decode);
		expect(utilMock.base64Encode).toStrictEqual(base64Encode);
		expect(utilMock.dynamodb).toStrictEqual(dynamodb);
		expect(utilMock.error).toStrictEqual(error);
		expect(utilMock.runtime).toStrictEqual(runtime);
		expect(utilMock.time).toStrictEqual(time);
		expect(utilMock.unauthorized).toStrictEqual(unauthorized);
		expect(utilMock.urlDecode).toStrictEqual(urlDecode);
		expect(utilMock.urlEncode).toStrictEqual(urlEncode);
	});
});
