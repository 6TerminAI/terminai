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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const terminAIManager_1 = require("./terminAIManager");
const aiService_1 = require("./aiService");
const configurationManager_1 = require("./configurationManager");
/**
 * TerminAI VS Code Extension
 * AI-powered terminal assistant for VS Code
 */
function activate(context) {
    console.log('TerminAI extension is now active!');
    // Initialize services
    const configManager = new configurationManager_1.ConfigurationManager();
    const aiService = new aiService_1.AIService(configManager);
    const terminalManager = new terminAIManager_1.TerminalManager(aiService);
    // Register commands
    const openTerminalCommand = vscode.commands.registerCommand('terminai.openTerminal', () => {
        terminalManager.openAITerminal();
    });
    const executeCommandCommand = vscode.commands.registerCommand('terminai.executeCommand', () => {
        terminalManager.executeAICommand();
    });
    const analyzeCodeCommand = vscode.commands.registerCommand('terminai.analyzeCode', () => {
        terminalManager.analyzeCurrentCode();
    });
    // Add to subscriptions
    context.subscriptions.push(openTerminalCommand);
    context.subscriptions.push(executeCommandCommand);
    context.subscriptions.push(analyzeCodeCommand);
    context.subscriptions.push(terminalManager);
}
exports.activate = activate;
function deactivate() {
    console.log('TerminAI extension is now deactivated!');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map