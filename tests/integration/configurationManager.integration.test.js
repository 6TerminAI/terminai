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
const configurationManager_1 = require("../../src/configurationManager");
/**
 * Integration Test: ConfigurationManager with VS Code API
 *
 * This test verifies that the ConfigurationManager properly integrates with the VS Code API
 * and can retrieve and set configuration values.
 */
describe('ConfigurationManager Integration', () => {
    let configurationManager;
    beforeEach(() => {
        configurationManager = new configurationManager_1.ConfigurationManager();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should retrieve configuration from VS Code', () => {
        // Mock VS Code configuration API
        const mockGet = jest.fn().mockReturnValue('test-api-key');
        vscode.workspace.getConfiguration.mockReturnValue({
            get: mockGet
        });
        // Test configuration retrieval
        const apiKey = configurationManager.getAPIKey();
        // Verify the configuration was retrieved correctly
        expect(apiKey).toBe('test-api-key');
        expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith('terminAI');
    });
    it('should handle missing configuration gracefully', () => {
        // Mock VS Code configuration API with undefined value
        const mockGet = jest.fn().mockReturnValue(undefined);
        vscode.workspace.getConfiguration.mockReturnValue({
            get: mockGet
        });
        // Test configuration retrieval
        const apiKey = configurationManager.getAPIKey();
        // Verify the configuration handles missing values correctly
        expect(apiKey).toBeNull();
    });
});
//# sourceMappingURL=configurationManager.integration.test.js.map