import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import {
	base64Decode,
	base64Encode,
	urlDecode,
	urlEncode,
} from './encoding.js';

describe('encoding', () => {
	describe('base64Decode', () => {
		it('returns expected value', () => {
			const utf8 = 'some string';
			const base64 = Buffer.from(utf8, 'utf8').toString('base64');

			const result = base64Decode(base64);

			expect(base64Decode).toBeCalledWith(base64);
			expect(result).toEqual(utf8);
		});
	});

	describe('base64Encode', () => {
		it('returns expected value', () => {
			const utf8 = 'some string';
			const base64 = Buffer.from(utf8, 'utf8').toString('base64');

			const result = base64Encode(utf8);

			expect(base64Encode).toBeCalledWith(utf8);
			expect(result).toEqual(base64);
		});
	});

	describe('urlDecode', () => {
		it('returns expected value', () => {
			const url = 'https://foo.com/bar?bat=baz&encodeme=%%..';
			const encoded = encodeURI(url);

			const result = urlDecode(encoded);

			expect(urlDecode).toBeCalledWith(encoded);
			expect(result).toEqual(url);
		});
	});

	describe('urlEncode', () => {
		it('returns expected value', () => {
			const url = 'https://foo.com/bar?bat=baz&encodeme=%%..';
			const encoded = encodeURI(url);

			const result = urlEncode(url);

			expect(urlEncode).toBeCalledWith(url);
			expect(result).toEqual(encoded);
		});
	});
});
