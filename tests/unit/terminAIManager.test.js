"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminAIManager_1 = require("../../src/terminAIManager");
// Mock the VS Code API
jest.mock('vscode', () => {
    return {
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn(),
            showInputBox: jest.fn()
        },
        commands: {
            registerCommand: jest.fn()
        },
        workspace: {
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        }
    };
});
describe('TerminAIManager', () => {
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
    test('should create TerminAIManager instance', () => {
        expect(terminAIManager).toBeInstanceOf(terminAIManager_1.TerminAIManager);
    });
    test('should have initialize method', () => {
        expect(typeof terminAIManager.initialize).toBe('function');
    });
    test('should have dispose method', () => {
        expect(typeof terminAIManager.dispose).toBe('function');
    });
    test('should initialize correctly', async () => {
        const result = await terminAIManager.initialize();
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=terminAIManager.test.js.map