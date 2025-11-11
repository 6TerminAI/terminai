/**
 * Integration Test: Configuration Management
 * 
 * This test verifies that the configuration management works correctly
 * with the VS Code settings system.
 */

import * as vscode from 'vscode';
import { ConfigurationManager } from '../../src/configurationManager';

describe('Configuration Management Integration', () => {
    let configurationManager: ConfigurationManager;
    
    beforeEach(() => {
        configurationManager = new ConfigurationManager();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve API key from VS Code settings', () => {
        // Mock VS Code configuration API
        const mockGet = jest.fn();
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet
        });
        
        // Set up mock return value
        mockGet.mockReturnValue('test-api-key');
        
        // Test configuration retrieval
        const apiKey = configurationManager.getAPIKey();
        
        // Verify the configuration was retrieved correctly
        expect(apiKey).toBe('test-api-key');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminai');
        expect(mockGet).toHaveBeenCalledWith('apiKey');
    });

    it('should handle missing API key configuration gracefully', () => {
        // Mock VS Code configuration API
        const mockGet = jest.fn();
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: mockGet
        });
        
        // Set up mock return value for missing config
        mockGet.mockReturnValue(undefined);
        
        // Test configuration retrieval
        const apiKey = configurationManager.getAPIKey();
        
        // Verify the configuration handles missing values correctly
        expect(apiKey).toBeNull();
    });
    
    it('should retrieve model configuration from VS Code settings', () => {
        // Mock VS Code configuration API
        const mockConfiguration = {
            get: jest.fn()
        };
        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue(mockConfiguration);
        
        // Set up mock return value for model
        mockConfiguration.get.mockReturnValue('gpt-4');
        
        // Test model configuration retrieval
        const model = (configurationManager as any).getConfiguration('model');
        
        // Verify the configuration was retrieved correctly
        expect(model).toBe('gpt-4');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminai');
        expect(mockConfiguration.get).toHaveBeenCalledWith('model');
    });
});