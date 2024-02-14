import { describe, expect, it } from 'vitest';
import ksuid from 'ksuid';
import { isValid as ulidIsValid } from 'ulidx';
import { validate as uuidIsValid } from 'uuid';
import { autoKsuid, autoUlid, autoUuid } from './ids.js';

describe('ids', () => {
	describe('autoKsuid', () => {
		it('returns valid ksuid', () => {
			const id = autoKsuid();
			const idBuffer = ksuid.parse(id).raw;

			expect(autoKsuid).toBeCalled();
			expect(ksuid.isValid(idBuffer)).toBe(true);
		});
	});

	describe('autoUlid', () => {
		it('returns valid ksuid', () => {
			const id = autoUlid();

			expect(autoUlid).toBeCalled();
			expect(ulidIsValid(id)).toBe(true);
		});
	});

	describe('autoUuid', () => {
		it('returns valid ksuid', () => {
			const id = autoUuid();

			expect(autoUuid).toBeCalled();
			expect(uuidIsValid(id)).toBe(true);
		});
	});
});
