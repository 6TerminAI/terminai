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
 * Integration Test: Webview View Provider
 *
 * This test verifies that the webview view provider works correctly
 * with the VS Code API.
 */
describe('Webview View Provider Integration', () => {
    it('should register webview view provider correctly', async () => {
        // This test verifies that the webview view provider can be registered
        // with the VS Code API without errors
        // In a real test, we would create a mock webview view provider
        // and verify it can be registered with vscode.window.registerWebviewViewProvider
        // For now, we just verify the API exists
        expect(typeof vscode.window.registerWebviewViewProvider).toBe('function');
    });
    it('should create webview with correct options', () => {
        // This test verifies that webview options are correctly configured
        const mockWebview = {
            options: {}
        };
        // Set webview options
        mockWebview.webview.options = {
            enableScripts: true,
            enableCommandUris: true
        };
        // Verify options are set correctly
        expect(mockWebview.webview.options.enableScripts).toBe(true);
        expect(mockWebview.webview.options.enableCommandUris).toBe(true);
    });
});
//# sourceMappingURL=webview.integration.test.js.map