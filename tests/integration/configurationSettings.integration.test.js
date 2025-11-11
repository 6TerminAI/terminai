"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
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
//# sourceMappingURL=configurationSettings.integration.test.js.map