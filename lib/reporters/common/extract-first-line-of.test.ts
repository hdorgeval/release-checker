import { EOL } from 'os';
import { extractFirstLineOf } from './extract-first-line-of';

test('It should return same string when input is only one line', () => {
  // Given
  const input = 'mono line';

  // When
  const result = extractFirstLineOf(input);

  // Then
  expect(result).toBe(input);
});

test('It should return first line when input is multi lines', () => {
  // Given
  const line1 = 'first line';
  const line2 = 'second line';
  const input = [line1, line2].join(EOL);

  // When
  const result = extractFirstLineOf(input);

  // Then
  expect(result).toBe(line1);
});
