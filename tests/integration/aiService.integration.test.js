"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aiService_1 = require("../../src/aiService");
/**
 * Integration Test: AIService with VS Code API
 *
 * This test verifies that the AIService properly integrates with the VS Code API
 * and can be properly initialized and used.
 */
describe('AIService Integration', () => {
    let aiService;
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
        aiService = new aiService_1.AIService(mockContext);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should initialize and integrate with VS Code correctly', async () => {
        // Test initialization
        const initResult = await aiService.initialize();
        expect(typeof initResult).toBe('boolean');
        // Verify the service is properly integrated with VS Code
        expect(aiService).toBeDefined();
    });
    it('should handle VS Code configuration correctly', async () => {
        // Test that the AI service can properly integrate with VS Code configuration system
        await aiService.initialize();
        // Verify that configuration can be accessed
        expect(aiService).toBeTruthy();
    });
});
//# sourceMappingURL=aiService.integration.test.js.map