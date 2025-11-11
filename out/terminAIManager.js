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
exports.TerminalManager = void 0;
const vscode = __importStar(require("vscode"));
class TerminalManager {
    constructor(aiService) {
        this.aiService = aiService;
        this.disposables = [];
        this.setupTerminalListeners();
    }
    /**
     * Open AI-powered terminal
     */
    async openAITerminal() {
        if (!this.aiTerminal) {
            this.aiTerminal = vscode.window.createTerminal({
                name: 'TerminAI',
                shellPath: 'node',
                shellArgs: ['-e', 'console.log("TerminAI Terminal Ready")']
            });
        }
        this.aiTerminal.show();
        // Show welcome message
        this.aiTerminal.sendText('echo "🤖 Welcome to TerminAI - AI-powered Terminal Assistant"');
        this.aiTerminal.sendText('echo "Type \'help\' for available commands"');
    }
    /**
     * Execute AI command based on user input
     */
    async executeAICommand() {
        const command = await vscode.window.showInputBox({
            prompt: 'Enter command or question for AI assistance',
            placeHolder: 'e.g., "how to install dependencies" or "git commit best practices"'
        });
        if (!command) {
            return;
        }
        try {
            const response = await this.aiService.processCommand(command);
            await this.showAIResponse(response);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AI service error: ${error}`);
        }
    }
    /**
     * Analyze current code in editor
     */
    async analyzeCurrentCode() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }
        const code = editor.document.getText();
        if (!code.trim()) {
            vscode.window.showWarningMessage('No code to analyze');
            return;
        }
        try {
            const analysis = await this.aiService.analyzeCode(code, editor.document.languageId);
            await this.showCodeAnalysis(analysis);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Code analysis error: ${error}`);
        }
    }
    /**
     * Show AI response in output channel
     */
    async showAIResponse(response) {
        const panel = vscode.window.createWebviewPanel('terminaiResponse', 'TerminAI Response', vscode.ViewColumn.Beside, {});
        panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: var(--vscode-font-family); 
                        padding: 20px; 
                        background: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .response { 
                        white-space: pre-wrap; 
                        line-height: 1.5;
                    }
                </style>
            </head>
            <body>
                <div class="response">${this.escapeHtml(response)}</div>
            </body>
            </html>
        `;
    }
    /**
     * Show code analysis results
     */
    async showCodeAnalysis(analysis) {
        const panel = vscode.window.createWebviewPanel('terminaiAnalysis', 'Code Analysis', vscode.ViewColumn.Beside, {});
        panel.webview.html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        font-family: var(--vscode-font-family); 
                        padding: 20px; 
                        background: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .analysis { 
                        white-space: pre-wrap; 
                        line-height: 1.5;
                    }
                </style>
            </head>
            <body>
                <h3>Code Analysis Results</h3>
                <div class="analysis">${this.escapeHtml(analysis)}</div>
            </body>
            </html>
        `;
    }
    /**
     * Setup terminal event listeners
     */
    setupTerminalListeners() {
        const disposable = vscode.window.onDidCloseTerminal((terminal) => {
            if (terminal === this.aiTerminal) {
                this.aiTerminal = undefined;
            }
        });
        this.disposables.push(disposable);
    }
    /**
     * Escape HTML for webview display
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    /**
     * Cleanup resources
     */
    dispose() {
        this.disposables.forEach(d => d.dispose());
        if (this.aiTerminal) {
            this.aiTerminal.dispose();
        }
    }
}
exports.TerminalManager = TerminalManager;
//# sourceMappingURL=terminAIManager.js.map