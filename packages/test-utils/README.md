# @mikecbrant/appsyncjs-test-utils

This is package is inteded to provide utilities suitable conducting both unit and functional testing for AWS AppSync resolvers written in the `APPSYNC_JS` runtime environment.

The `APPSYNC_JS` runtime environment offers a Javascript-like set of features geared at making it easier for developers to write performant resovlers without the need to learn the legacy VTL mapping templates syntax which was formerly the primary means for implementing AppSync resolver logic.

Related reading:

- [Javascript resolvers overview](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html)
- [APPSYNC_JS runtime features](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference-js.html).

The following packages are published by AWS for use in helping to develop resolvers using `APPSYNC_JS` (especially using TypeScript)

- [@aws-appsync/utils](https://www.npmjs.com/package/@aws-appsync/utils)
- [@aws-appsync/eslint-plugin](https://www.npmjs.com/package/@aws-appsync/eslint-plugin)

This library is intended to work along with `@aws-appsync/utils` which should be installed in your application as a dependency.

## Unit testing resolvers

`@aws-appsync/utils` only provides TypeScript types for helping write resolver request and response handlers. As such, it is impossible to effectively unit test the code in such resolvers using this library alone.

Take the following [example from the AWS docs ](https://docs.aws.amazon.com/appsync/latest/devguide/js-resolver-reference-dynamodb.html) and say you wanted to run a unit test on the `request` function to verify the returned `UpdateItemRequest` shape.

```js
import { util } from '@aws-appsync/utils';
export function request(ctx) {
	const { id } = ctx.args;
	return {
		operation: 'UpdateItem',
		// this line throws error
		key: util.dynamodb.toMapValues({ id }),
		update: {
			expression: 'ADD #votefield :plusOne, version :plusOne',
			expressionNames: { '#votefield': 'upvotes' },
			expressionValues: { ':plusOne': { N: 1 } },
		},
	};
}
```

An error is thrown because `util` is implemented as an empty object, so `util.dynamodb` is `undefined`.

This library provides a `utilMock` export which can be used to mock `@aws-appsync/utils` using `vitest`, which needs to be installed in your application as a dev dependency.

Here is how a `vitest` unit test for the above code might look when using `utilMock`.

```js
// in global vitest.config.ts...

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// ... other configs
		// set clearMocks true to automatically clear utilMock between test cases
		clearMocks: true,
	},
	// ... other configs
});
```

```js
import { describe, it, expect, vi } from 'vitest';
import { request } from './path/to/resolver.js';

vi.mock('@aws-appsync/utils', async () => {
	const original = await vi.importActual('@aws-appsync/utils');
	// we must import utilMock
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return {
		...original,
		util: utilMock,
	};
});

describe('request', () => {
	// because of the way vitest hoists the vi.mock above
	// we cannot set a local reference to the mock in global scope
	let utilMock;

	// ...instead, we set it here after @aws-appsync/utils
	// module has been mocked
	beforeEach(async () => {
		const mock = await import('@aws-appsync/utils');
		utilMock = mock.util;
	});

	it('request', () => {
		const id = 'foo';
		const ctx = { args: { id } };
		const result = request(ctx);

		expect(utilMock.dynamodb.toMapValues).toHaveBeenCalledWith(id);
		// ... other assertions
	});
});
```

## Functionality implemented in utilMock

Currently the following utilities have been implemented in `utilMock`:

- `autoId`, `autoUlid`, `autoKsuid` [ID generation utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-id-gen-js)
- `util.error`, `util.appendError` [Error utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-error-js)
  - note that these mocks simply log to `console.error` and do not provide any of the AppSync / GraphQL related behaviors related to resolver evaluation or response decoration
  - it is recommended that `return util.error(...)` be used in code if you need testable ability to exit request/response handler exeuction
- all [DynamoDB helpers in util.dynamodb](https://docs.aws.amazon.com/appsync/latest/devguide/dynamodb-helpers-in-util-dynamodb-js.html)
- `util.time.nowISO8601` from [Time helpers](https://docs.aws.amazon.com/appsync/latest/devguide/time-helpers-in-util-time-js.html)
