"use strict";
// jest.setup.ts
// Setup for Jest tests
// Mock VS Code API globally
jest.mock('vscode', () => require('./tests/__mocks__/vscode'), { virtual: true });
// Setup code that runs before each test
beforeEach(() => {
    // Any setup code that should run before each test
});
afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
});
//# sourceMappingURL=jest.setup.js.map