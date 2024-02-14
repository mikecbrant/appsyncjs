import type { Mock } from 'vitest';
import { appendError, error } from './errors.js';
import { autoKsuid, autoUlid, autoUuid } from './ids.js';
import dynamodb from './dynamodb-mock.js';
import time from './time.js';

type UtilMock = {
	appendError: Mock;
	autoKsuid: Mock;
	autoUlid: Mock;
	autoUuid: Mock;
	dynamodb: Record<string, Mock>;
	error: Mock;
	time: Record<string, Mock>;
};

const utilMock: UtilMock = {
	appendError,
	autoKsuid,
	autoUlid,
	autoUuid,
	dynamodb,
	error,
	time,
};

export { utilMock as default };
