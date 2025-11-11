"use strict";
/**
 * Integration Test: Configuration Management
 *
 * This test verifies that the configuration management works correctly
 * with the VS Code settings system.
 */
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
const configurationManager_1 = require("../../src/configurationManager");
describe('Configuration Management Integration', () => {
    let configurationManager;
    beforeEach(() => {
        configurationManager = new configurationManager_1.ConfigurationManager();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should retrieve API key from VS Code settings', () => {
        // Mock VS Code configuration API
        const mockGet = jest.fn();
        vscode.workspace.getConfiguration.mockReturnValue({
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
        vscode.workspace.getConfiguration.mockReturnValue({
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
        vscode.workspace.getConfiguration.mockReturnValue(mockConfiguration);
        // Set up mock return value for model
        mockConfiguration.get.mockReturnValue('gpt-4');
        // Test model configuration retrieval
        const model = configurationManager.getConfiguration('model');
        // Verify the configuration was retrieved correctly
        expect(model).toBe('gpt-4');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminai');
        expect(mockConfiguration.get).toHaveBeenCalledWith('model');
    });
});
//# sourceMappingURL=configuration.integration.test.js.map