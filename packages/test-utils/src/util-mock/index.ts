import { unauthorized } from './authorization.js';
import dynamodb from './dynamodb-mock.js';
import {
	base64Decode,
	base64Encode,
	urlDecode,
	urlEncode,
} from './encoding.js';
import { appendError, error } from './errors.js';
import { autoKsuid, autoUlid, autoUuid } from './ids.js';
import runtime from './runtime.js';
import time from './time.js';
import { authType } from './type-and-pattern-matching.js';

import type { Mock } from 'vitest';

type UtilMock = {
	appendError: Mock;
	authType: Mock;
	autoKsuid: Mock;
	autoUlid: Mock;
	autoUuid: Mock;
	base64Decode: Mock;
	base64Encode: Mock;
	dynamodb: Record<string, Mock>;
	error: Mock;
	runtime: Record<string, Mock>;
	time: Record<string, Mock>;
	unauthorized: Mock;
	urlDecode: Mock;
	urlEncode: Mock;
};

const utilMock: UtilMock = {
	appendError,
	authType,
	autoKsuid,
	autoUlid,
	autoUuid,
	base64Decode,
	base64Encode,
	dynamodb,
	error,
	runtime,
	time,
	unauthorized,
	urlDecode,
	urlEncode,
};

export { utilMock as default };
