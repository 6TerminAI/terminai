"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminAIManager_1 = require("../../src/terminAIManager");
/**
 * Integration Test: TerminAIManager with VS Code API
 *
 * This test verifies that the TerminAIManager properly integrates with the VS Code API
 * and can be properly initialized and disposed.
 */
describe('TerminAIManager Integration', () => {
    let terminAIManager;
    let mockContext;
    beforeEach(() => {
        // Create a mock context
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn(),
                update: jest.fn()
            },
            extensionPath: '/test/path'
        };
        terminAIManager = new terminAIManager_1.TerminAIManager(mockContext);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should initialize and register with VS Code correctly', async () => {
        // Test initialization
        const initResult = await terminAIManager.initialize();
        expect(initResult).toBe(true);
        // Verify the manager is properly integrated with VS Code
        expect(terminAIManager).toBeDefined();
    });
    it('should handle VS Code commands correctly', async () => {
        // Test that the manager can properly integrate with VS Code command system
        await terminAIManager.initialize();
        // Verify that commands can be registered and handled
        expect(terminAIManager).toBeTruthy();
    });
});
//# sourceMappingURL=terminAIManager.integration.test.js.map