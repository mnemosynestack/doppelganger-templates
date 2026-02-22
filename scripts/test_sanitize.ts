// scripts/test_sanitize.ts
import { sanitizeUrl } from '../src/lib/utils';
import assert from 'assert';

console.log('Running sanitizeUrl tests...');

const testCases = [
    { input: 'https://example.com', expected: 'https://example.com' },
    { input: 'http://example.com', expected: 'http://example.com' },
    { input: 'javascript:alert(1)', expected: undefined },
    { input: 'data:text/html,<html>', expected: undefined },
    { input: '', expected: undefined },
    { input: null, expected: undefined },
    { input: undefined, expected: undefined },
    { input: 'invalid-url', expected: undefined },
];

let passed = true;
testCases.forEach(({ input, expected }, index) => {
    const result = sanitizeUrl(input);
    try {
        assert.strictEqual(result, expected);
        console.log(`Test ${index + 1} passed: ${input} -> ${result}`);
    } catch (e) {
        console.error(`Test ${index + 1} failed: ${input} -> ${result} (expected ${expected})`);
        passed = false;
    }
});

if (passed) {
    console.log('All tests passed!');
    process.exit(0);
} else {
    console.error('Some tests failed.');
    process.exit(1);
}
