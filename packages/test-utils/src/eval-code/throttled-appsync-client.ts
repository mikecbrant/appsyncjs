import {
	AppSyncClient,
	type AppSyncClientConfig,
	type EvaluateCodeCommand,
	type EvaluateCodeCommandOutput,
} from '@aws-sdk/client-appsync';

// Limiting to scope of commands currently used in this tooling
type SupportedCommand = EvaluateCodeCommand;
type SupportedOutput = EvaluateCodeCommandOutput;

const runtimeRegion = process.env.AWS_REGION;

const delay = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const isThrottleError = (err: Error): boolean =>
	err.name === 'TooManyRequestsException' ||
	err.message === 'Too Many Requests';

type ThrottledAppsyncClientConfig = AppSyncClientConfig & {
	// For send request throttling
	maxRetries?: number;
	opsPerSecond?: number;
};

class ThrottledAppsyncClient extends AppSyncClient {
	static readonly defaultMaxRetries: 3;
	static readonly defaultOpsPerSecond: 5;
	firstRequestAt: number;
	requestCount: number;
	readonly maxRetries: number;
	readonly opsPerSecond: number;
	readonly requestInterval: number;
	private retryCounter: WeakMap<SupportedCommand, number>;

	constructor(opts?: ThrottledAppsyncClientConfig) {
		const {
			maxRetries = ThrottledAppsyncClient.defaultMaxRetries,
			opsPerSecond = ThrottledAppsyncClient.defaultOpsPerSecond,
			region = runtimeRegion,
			...otherOpts
		} = opts ?? {};
		super({
			...(region !== undefined ? { region } : {}),
			...otherOpts,
		});
		this.maxRetries = maxRetries;
		this.opsPerSecond = opsPerSecond;
		this.requestInterval = 1000 / opsPerSecond;
		this.firstRequestAt = 0;
		this.requestCount = 0;
		this.retryCounter = new WeakMap();
	}

	async retry(command: SupportedCommand): Promise<SupportedOutput> {
		let retryCount = this.retryCounter.get(command) ?? 0;
		retryCount++;

		if (retryCount > this.maxRetries) {
			const msg = 'Max retries for Appsync command reached';
			console.error(msg, command);
			throw new Error(msg);
		}

		this.retryCounter.set(command, retryCount);

		return this.send(command);
	}

	override async send(command: SupportedCommand): Promise<SupportedOutput> {
		await this.throttle();
		return super.send(command).catch(async (err) => {
			if (isThrottleError(err)) {
				console.warn('Command send throttled', command, err);
				return this.retry(command);
			}

			console.error('Command send error', command, err);
			throw err;
		});
	}

	async throttle(): Promise<void> {
		this.firstRequestAt ||= Date.now();
		this.requestCount++;

		const executeAfter =
			this.firstRequestAt + this.requestCount * this.requestInterval;
		const waitFor = executeAfter - Date.now();

		if (waitFor > 0) {
			await delay(waitFor);
		}
	}
}

let client: ThrottledAppsyncClient | undefined;

const getThrottledClient = (
	opts?: ThrottledAppsyncClientConfig,
): ThrottledAppsyncClient => {
	client ||= new ThrottledAppsyncClient(opts);
	return client;
};

export { getThrottledClient, ThrottledAppsyncClient };
