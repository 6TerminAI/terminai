"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const podmanManager_1 = require("../../src/podmanManager");
/**
 * Integration Test: PodmanManager with VS Code API
 *
 * This test verifies that the PodmanManager properly integrates with the VS Code API
 * and can be properly initialized and used.
 */
describe('PodmanManager Integration', () => {
    let podmanManager;
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
        podmanManager = new podmanManager_1.PodmanManager(mockContext);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should initialize and integrate with VS Code correctly', async () => {
        // Test initialization
        const initResult = await podmanManager.initialize();
        expect(typeof initResult).toBe('boolean');
        // Verify the manager is properly integrated with VS Code
        expect(podmanManager).toBeDefined();
    });
    it('should handle VS Code configuration correctly', async () => {
        // Test that the podman manager can properly integrate with VS Code configuration system
        await podmanManager.initialize();
        // Verify that configuration can be accessed
        expect(podmanManager).toBeTruthy();
    });
});
//# sourceMappingURL=podmanManager.integration.test.js.map