import ksuid from 'ksuid';
import { ulid } from 'ulidx';
import { v4 as uuidv4 } from 'uuid';
import { type Mock, vi } from 'vitest';

const autoKsuidImplementation = (): string => ksuid.randomSync().string;

const autoKsuid: Mock = vi.fn(autoKsuidImplementation);

const autoUlidImplementation = (): string => ulid();

const autoUlid: Mock = vi.fn(autoUlidImplementation);

const autoUuidImplementation = (): string => uuidv4();

const autoUuid: Mock = vi.fn(autoUuidImplementation);

export { autoKsuid, autoUlid, autoUuid };
