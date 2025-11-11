import { TerminAIManager } from '../../src/terminAIManager';
import * as vscode from 'vscode';

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
    let terminAIManager: TerminAIManager;
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

        terminAIManager = new TerminAIManager(mockContext);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create TerminAIManager instance', () => {
        expect(terminAIManager).toBeInstanceOf(TerminAIManager);
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