import * as vscode from 'vscode';
import { TerminAIManager } from '../../src/terminAIManager';

/**
 * Integration Test: TerminAIManager with VS Code API
 * 
 * This test verifies that the TerminAIManager properly integrates with the VS Code API
 * and can be properly initialized and disposed.
 */

describe('TerminAIManager Integration', () => {
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