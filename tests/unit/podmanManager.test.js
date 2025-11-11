"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const podmanManager_1 = require("../../src/podmanManager");
// Mock the VS Code API
jest.mock('vscode', () => {
    return {
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        }
    };
});
describe('PodmanManager', () => {
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
    test('should create PodmanManager instance', () => {
        expect(podmanManager).toBeInstanceOf(podmanManager_1.PodmanManager);
    });
    test('should have initialize method', () => {
        expect(typeof podmanManager.initialize).toBe('function');
    });
    test('should have isInitialized method', () => {
        expect(typeof podmanManager.isInitialized).toBe('function');
    });
    test('should have dispose method', () => {
        expect(typeof podmanManager.dispose).toBe('function');
    });
    test('should initialize correctly', async () => {
        const result = await podmanManager.initialize();
        expect(typeof result).toBe('boolean');
    });
    test('should return correct initialization status', () => {
        const status = podmanManager.isInitialized();
        expect(typeof status).toBe('boolean');
    });
});
//# sourceMappingURL=podmanManager.test.js.map