# Testing Guide

This directory contains unit and integration tests for IEA Portal.

## Running Tests

### Install Jest
```bash
npm install --save-dev jest
```

### Run All Tests
```bash
npm test
# or
npx jest
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npx jest example.test.js
```

## Writing Tests

### Test Structure
```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup before each test
    });

    test('should do something', () => {
        expect(value).toBe(expected);
    });

    afterEach(() => {
        // Cleanup after each test
    });
});
```

### Common Assertions
```javascript
expect(value).toBe(expected);           // Strict equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();             // Truthy
expect(value).toBeFalsy();              // Falsy
expect(array).toContain(item);          // Array contains
expect(fn).toThrow();                   // Function throws
expect(fn).toHaveBeenCalled();          // Function called
```

### Testing Async Code
```javascript
test('should fetch data', async () => {
    const data = await fetchData();
    expect(data).toBeDefined();
});

// Or with done callback
test('should fetch data', (done) => {
    fetchData().then(data => {
        expect(data).toBeDefined();
        done();
    });
});
```

### Mocking
```javascript
// Mock a module
jest.mock('../api');

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ data: 'test' })
    })
);
```

## Test Coverage

Target coverage thresholds:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

View coverage report:
```bash
npm test -- --coverage
# Then open coverage/lcov-report/index.html
```

## Test Files

- `example.test.js` - Example and reference tests

### Adding More Tests
1. Create `featureName.test.js` in `__tests__/` directory
2. Import modules to test
3. Write descriptive test cases
4. Run `npm test` to verify

## Best Practices

- ✅ Write tests for critical functionality
- ✅ Use descriptive test names
- ✅ Keep tests focused and simple
- ✅ Mock external dependencies
- ✅ Test both success and failure cases
- ✅ Use setup/teardown methods
- ✅ Avoid testing implementation details

## Continuous Integration

GitHub Actions will run tests automatically on push/PR:
- [See workflow](.github/workflows/test.yml)

---

For more info: [Jest Documentation](https://jestjs.io/)
