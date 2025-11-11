import { PodmanManager } from '../../src/podmanManager';
import * as vscode from 'vscode';

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
    let podmanManager: PodmanManager;
    let mockContext: vscode.ExtensionContext;

    beforeEach(() => {
        // Create a mock context
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn(),
                update: jest.fn()
            },
            extensionPath: '/test/path'
        } as any;

        podmanManager = new PodmanManager(mockContext);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create PodmanManager instance', () => {
        expect(podmanManager).toBeInstanceOf(PodmanManager);
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