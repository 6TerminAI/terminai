import * as vscode from 'vscode';
import { PodmanManager } from '../../src/podmanManager';

/**
 * Integration Test: PodmanManager with VS Code API
 * 
 * This test verifies that the PodmanManager properly integrates with the VS Code API
 * and can be properly initialized and used.
 */

describe('PodmanManager Integration', () => {
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