import { Scene } from 'three';
import { expect, test } from 'vitest';

test('le socle de test fonctionne sous Node sans navigateur', () => {
  expect(typeof window).toBe('undefined');
  expect(typeof document).toBe('undefined');
  expect(new Scene().isScene).toBe(true);
});
