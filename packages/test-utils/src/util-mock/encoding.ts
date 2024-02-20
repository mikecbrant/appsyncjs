import { Buffer } from 'node:buffer';
import { type Mock, vi } from 'vitest';

const base64DecodeImplementation = (str: string): string =>
	Buffer.from(str, 'base64').toString('utf8');

const base64Decode: Mock = vi.fn(base64DecodeImplementation);

const base64EncodeImplementation = (str: string): string =>
	Buffer.from(str, 'utf8').toString('base64');

const base64Encode: Mock = vi.fn(base64EncodeImplementation);

const urlDecodeImplementation = (str: string): string => decodeURI(str);

const urlDecode: Mock = vi.fn(urlDecodeImplementation);

const urlEncodeImplementation = (str: string): string => encodeURI(str);

const urlEncode: Mock = vi.fn(urlEncodeImplementation);

export { base64Decode, base64Encode, urlDecode, urlEncode };
