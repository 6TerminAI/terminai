"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aiService_1 = require("../../src/aiService");
// Mock the VS Code API
jest.mock('vscode', () => {
    return {
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        },
        workspace: {
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        }
    };
});
describe('AIService', () => {
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
    test('should create AIService instance', () => {
        expect(aiService).toBeInstanceOf(aiService_1.AIService);
    });
    test('should have initialize method', () => {
        expect(typeof aiService.initialize).toBe('function');
    });
    test('should have dispose method', () => {
        expect(typeof aiService.dispose).toBe('function');
    });
    test('should have sendMessage method', () => {
        expect(typeof aiService.sendMessage).toBe('function');
    });
    test('should initialize correctly', async () => {
        const result = await aiService.initialize();
        expect(typeof result).toBe('boolean');
    });
});
//# sourceMappingURL=aiService.test.js.map