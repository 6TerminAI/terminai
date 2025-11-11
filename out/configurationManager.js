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
exports.ConfigurationManager = void 0;
const vscode = __importStar(require("vscode"));
class ConfigurationManager {
    constructor() {
        this.config = vscode.workspace.getConfiguration('terminai');
    }
    /**
     * Get API key from configuration
     */
    getApiKey() {
        return this.config.get('apiKey', '');
    }
    /**
     * Get AI model from configuration
     */
    getModel() {
        return this.config.get('model', 'gpt-4');
    }
    /**
     * Get maximum tokens from configuration
     */
    getMaxTokens() {
        return this.config.get('maxTokens', 1000);
    }
    /**
     * Update API key in configuration
     */
    async updateApiKey(apiKey) {
        await this.config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    }
    /**
     * Update AI model in configuration
     */
    async updateModel(model) {
        await this.config.update('model', model, vscode.ConfigurationTarget.Global);
    }
    /**
     * Update maximum tokens in configuration
     */
    async updateMaxTokens(maxTokens) {
        await this.config.update('maxTokens', maxTokens, vscode.ConfigurationTarget.Global);
    }
    /**
     * Check if configuration is valid
     */
    isValidConfiguration() {
        const apiKey = this.getApiKey();
        return apiKey.length > 0;
    }
    /**
     * Get configuration summary
     */
    getConfigurationSummary() {
        const apiKey = this.getApiKey();
        const model = this.getModel();
        const maxTokens = this.getMaxTokens();
        return `Configuration Summary:
• API Key: ${apiKey ? 'Configured' : 'Not configured'}
• Model: ${model}
• Max Tokens: ${maxTokens}
• Status: ${this.isValidConfiguration() ? '✅ Ready' : '❌ Needs configuration'}`;
    }
    /**
     * Open settings for configuration
     */
    async openSettings() {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'terminai');
    }
    /**
     * Validate API key format (basic validation)
     */
    validateApiKeyFormat(apiKey) {
        // Basic validation - in real implementation, this would be more specific
        // based on the AI service being used
        return apiKey.length >= 20 && apiKey.includes('_');
    }
    /**
     * Get available AI models
     */
    getAvailableModels() {
        return [
            'gpt-4',
            'gpt-4-turbo',
            'gpt-3.5-turbo',
            'claude-3-opus',
            'claude-3-sonnet',
            'claude-3-haiku',
            'gemini-pro'
        ];
    }
    /**
     * Check if model is supported
     */
    isModelSupported(model) {
        return this.getAvailableModels().includes(model);
    }
}
exports.ConfigurationManager = ConfigurationManager;
//# sourceMappingURL=configurationManager.js.map