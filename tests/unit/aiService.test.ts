import { AIService } from '../../src/aiService';
import * as vscode from 'vscode';

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
    let aiService: AIService;
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

        aiService = new AIService(mockContext);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create AIService instance', () => {
        expect(aiService).toBeInstanceOf(AIService);
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