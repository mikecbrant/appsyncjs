# @mikecbrant/appsyncjs-test-utils

This is package is intended to provide utilities suitable for conducting both unit and functional testing for AWS AppSync resolvers written in the `APPSYNC_JS` runtime environment.

## What is APPSYNC_JS ?

The `APPSYNC_JS` runtime environment offers a Javascript-like set of features geared at making it easier for developers to write performant resovlers without the need to learn the legacy VTL mapping templates syntax which was formerly the primary means for implementing AppSync resolver logic.

Related reading:

- [Javascript resolvers overview](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html)
- [APPSYNC_JS runtime features](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference-js.html).

The following packages are published by AWS for use in helping to develop resolvers using `APPSYNC_JS` (especially using TypeScript)

- [@aws-appsync/utils](https://www.npmjs.com/package/@aws-appsync/utils)
- [@aws-appsync/eslint-plugin](https://www.npmjs.com/package/@aws-appsync/eslint-plugin)

This library is intended to work along with `@aws-appsync/utils` which should be installed in your application as a dependency.

## Install

For best install of this framework and full set peer dependencies use...

```bash
pnpm i -D @mikecbrant/appsyncjs-cli @mikecbrant/appsyncjs-test-utils @aws-appsync/eslint-plugin @aws-appsync/utils @aws-sdk/client-appsync vitest

# or npm
npm i -D @mikecbrant/appsyncjs-cli @mikecbrant/appsyncjs-test-utils @aws-appsync/eslint-plugin @aws-appsync/utils @aws-sdk/client-appsync vitest
```

- `@aws-sdk/client-appsync` is peer dependency needed for `evaluateFile` / `evaluateCode` functional testing utils
- `vitest` is peer dependency needed for `utilMock` unit testing utility
- `@aws-appsync/eslint-plugin` is not needed by these libraries, but is recommended for use in linting your files for `APPSYNC_JS`

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
	// must import utilMock dynamically due to vitest hoisting
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
	beforeAll(async () => {
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

### Functionality implemented in utilMock

Currently the following utilities have been implemented in `utilMock`:

- `base64Decode`, `base64Encode`, `urlDecorde`, `urlEncode` [Encoding utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-encoding)
- `autoId`, `autoUlid`, `autoKsuid` [ID generation utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-id-gen-js)
- `util.error`, `util.appendError` [Error utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-error-js)
  - note that these mocks simply log to `console.error` and do not provide any of the AppSync / GraphQL related behaviors related to resolver evaluation or response decoration
  - it is recommended that `return util.error(...)` be used in code if you need testable ability to exit request/response handler execution
- `authType` from [Type and pattern matching utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-patterns-js)
  - note `authType` returns `User Pool Authorization` value by default
  - a different `authType` return value of can be set by overriding the mock implementation on a test or suite-specific basis as shown in the example below

```js
// change implementation for all tests in suite
beforeEach(() => {
	util.authType.mockImplementation(() => 'API Key Authorization');
});
```

- `unauthorized` from [Authorization utils](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-resolver-auth-js)
  - note that this mock simply logs to `console.error` and does not throw and exit function or provide any of the AppSync / GraphQL related behaviors related to resolver evaluation or response decoration
  - it is recommended that `return util.unauthorized()` be used in code if you need testable ability to exit request/response handler execution
- all [DynamoDB helpers in util.dynamodb](https://docs.aws.amazon.com/appsync/latest/devguide/dynamodb-helpers-in-util-dynamodb-js.html)
- all [Runtime utilities](https://docs.aws.amazon.com/appsync/latest/devguide/runtime-utils-js.html)
  - note `earlyReturn` simply logs to `console.info` and return input argument, but does not not exit function or provide any of the AppSync / GraphQL related behaviors related to resolver evaluation or response decoration
  - it is recommended that `return util.runtime.earlyReturn(...)` be used in code if you need testable ability to exit request/response handler execution
- `util.time.nowISO8601` from [Time helpers](https://docs.aws.amazon.com/appsync/latest/devguide/time-helpers-in-util-time-js.html)

## Functional testing for resolvers

The primary means for conducting functional testing of resolvers is via `EvaluateCode` API AppSync service call, typically using [EvaluateCodeCommand in aws-sdk](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/appsync/command/EvaluateCodeCommand/). This library provides tooling to simplify working around some of the rough edges of this service, especially for use in automated testing.

Some key considerations when testing with `EvaluateCode` API:

- You will quickly run up against API rate limits as you grow your test coverage
  - throttling test executions is important to scaling your test coverage
  - this library extends the underlying aws-sdk `AppSyncClient` class to provide reasonable means for throttling and retrying throttled requests in the context of parallel test execution
  - you will still need to set and manage throttle config and test timeouts relevant to your test setup. You should expect to run ~300 tests per minute with default throttle settings.
- There are three categories of errors that need to be disambiguated from the `EvaluateCodeCommand` `error` response shape.
  - message-only errors which are typically added by `util.error` and `util.appendError` calls. These are errors which are potentially surfaced in GraphQL responses and should be considered "normal" part of the response.
  - "compile"-time code errors generated during `EvaluateCode`. These represent some problem with your code and should be treated like an error in your code under test.
  - run-time message-only errors. These must be disambiguated from `util.*Error` messages by RegExp pattern. These are also errors with your code and should be treated as an error in your code under test.
  - the `evaluateCode` and `evaluateFile` methods exposed by this library throw `EvaluateCodeError` (a subclass of `AggregateError`) errors for last two cases. This let's you easily test code which interacts with `util.*Error` methods in normal `evaluate*` results, while letting your tests fail loudly with uncaught `EvaluateCodeError` when there is something wrong with your code. Each error contains pertinent details and contextual log entries on it's `errors` property.
- When using Typescript, the `EvaluateCodeCommandOutput` type is difficult to work with as pretty much all properties at all levels are optional due to loosely structured shape in combination with JSON string values.
  - this library provides stronger guarantees on both it's input and response shapes, along with managing with JSON serialization concerns with underlying API, leaving test code to work only with the shapes it expects at these boundaries.
- For most meaningful tests, you should pass in meaningful [AppSync context objects](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference-js.html) to exercise various code paths based on passed `args`, `stash`, etc.
  - currently `info` property can not be passed in context object, as it is not supported by `EvaluateCode` API :~(
- If writing your resolvers in Typescript, you need to build `APPSYNC_JS`-compliant code before testing it.
  - [@mikecbrant/appsyncjs-cli](https://www.npmjs.com/package/@mikecbrant/appsyncjs-cli) library offers CLI build tool for use in npm run scripts to eliminate need for local `esbuild` configurations.

### Usage

#### package.json

Typical run script config for an application using these tools might include the following:

```js
	scripts: {
		"build": "appsyncjs build",
		"test": "pnpm run build && vitest",
	},
```

#### Exports

```js
import {
	evaluateCode,
	EvaluateCodeError,
	evaluateFile,
	getThrottledClient,
} from '@mikecbrant/appsyncjs-test-utils';
```

- `evaluateFile` is probably the most useful of the exports as typically test cases would be set up to work with built distribution files holding `request` and `response` functions for a single top-level or step resolver. This function takes responsibility for reading file into string for usage on API.

```js
const { error, evaluationResult, logs } = await evaluateFile({
	file: '/path/to/built/file.js',
	context: { args: {}, stash: {}, /* ...other props */ }, // Appsync context object
	function: 'request', // or 'response' depending on function to test
});
```

- `evaluateCode` is used to pass code as string when needed. `evaluateFile` uses this under the hood after extracting file contents.
- `EvaluateCodeError` is subclass of `AggregateError` with no other additional functionality, just differnent name for distinction.
- `getThrottledClient` allows you to manually set up your `ThrottledAppsyncClient` instance with non-default configuations for `maxRetries`, `opsPerSecond` throttle setting or any other underlying `AppSyncClient` options, such as `region`.

#### Vitest example

There are two global test configuration settings which relate to our API request throttling. You will likely need to adjust these settings as you build out test coverage.

```js
{
	test: {
		// ...other configs

		// global timeout adjustment (if not done in test files)
		// may need to be adjusted based on your throttle rate
		// and overall test execution timeframe
		testTimeout: 30000,

		// by limiting threads, we try to run all tests via singleton
		// instance of throttle mechanism
		// this slows down overall test execution
		poolOptions: {
			threads: {
				singleThread: true,
			},
		},
	},
}
```

A test file using this functionality might look like the following:

```js
import { describe, expect, it, vi } from 'vitest';
import { glob } from 'glob';
import { readFile } from 'node:fs/promises';
import { evaluateCode, evaluateFile } from '@mikecbrant/appsyncjs-test-utils';

describe('my test suite', () => {
	it('passes basic check with no args or stash in context', async () => {
		const files = glob('/path/to/built/files/**/*.js');
		const context = { args: {}, stash: {} };

		const promises = [];

		files.forEach((file) => {
			// check both request and response
			promises.push(
				evaluateFile({
					file,
					context,
					function: 'request',
				}),
				evaluateFile({
					file,
					context,
					function: 'response',
				}),
			);
		});

		const results = await Promise.allSettled(promises);

		// we expect no rejections due to EvaluateCodeError
		results.forEach((result) => {
			expect(result.status).toEqual('fulfilled');
			// response detail available as...
			// const { error, evaluationResult, logs } = result.value;
		});
	});

	// example using lower-level evaluateCode
	it('request works with code read from file', async () => {
		const code = await readFile('/path/to/built/file.js');
		const context = { args: { foo: 'bar' } };
		const expected = { bat: 'baz' };

		const { error, evaluationResult, logs } = await evaluateCode({
			code,
			context,
			function: 'request',
		});

		expect(error).toEqual(undefined);
		expect(evaluationResult).toEqual(expected);
		expect(logs.length).toEqual(0);
	});
});
```

#### Throttle configuration

If you need to change the default `maxRetries` (`3`) and `opsPerSecond` (`5`) for the throttle mechanism, you can call `getThrottledClient` somewhere in test setup (before any `evaluate*` calls). This will initialize the `ThrottledAppsyncClient` singleton for the running process. This singleton would otherwise have been loaded lazily on first `evaluate*` call with default config.

Vitest example:

```js
describe('my test suite', async () => {
	beforeAll(() => {
		// initialize client singleton
		getThrottledClient({
			maxRetries: 2,
			opsPerSecond: 10,
			region: 'us-east-1',
			// ...other AppSyncClient opts
		});
	});

	// other tests
});
```
