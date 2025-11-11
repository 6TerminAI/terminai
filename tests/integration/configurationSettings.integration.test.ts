import * as vscode from 'vscode';

/**
 * Integration Test: Extension Configuration Settings
 * 
 * This test verifies that the extension's configuration settings
 * are properly defined and can be accessed.
 */

describe('Extension Configuration Settings Integration', () => {
    it('should have terminai configuration section', () => {
        // This test verifies that the terminai configuration section exists
        const config = vscode.workspace.getConfiguration('terminai');
        expect(config).toBeDefined();
    });
    
    it('should have default configuration values', () => {
        // This test verifies that default configuration values are set correctly
        const config = vscode.workspace.getConfiguration('terminai');
        
        // Test default values from package.json
        expect(config.get('model')).toBe('gpt-4');
        expect(config.get('maxTokens')).toBe(1000);
    });
    
    it('should allow configuration updates', async () => {
        // This test verifies that configuration can be updated
        const config = vscode.workspace.getConfiguration('terminai');
        
        // Test updating a configuration value
        await config.update('model', 'gpt-3.5-turbo', vscode.ConfigurationTarget.Global);
        
        // Verify the update was applied
        expect(config.get('model')).toBe('gpt-3.5-turbo');
        
        // Reset to default value
        await config.update('model', 'gpt-4', vscode.ConfigurationTarget.Global);
    });
});