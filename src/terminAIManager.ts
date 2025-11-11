import * as vscode from 'vscode';
import { AIService } from './aiService';

export class TerminalManager implements vscode.Disposable {
    private aiTerminal: vscode.Terminal | undefined;
    private disposables: vscode.Disposable[] = [];

    constructor(private aiService: AIService) {
        this.setupTerminalListeners();
    }

    /**
     * Open AI-powered terminal
     */
    public async openAITerminal(): Promise<void> {
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
    public async executeAICommand(): Promise<void> {
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
        } catch (error) {
            vscode.window.showErrorMessage(`AI service error: ${error}`);
        }
    }

    /**
     * Analyze current code in editor
     */
    public async analyzeCurrentCode(): Promise<void> {
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
        } catch (error) {
            vscode.window.showErrorMessage(`Code analysis error: ${error}`);
        }
    }

    /**
     * Show AI response in output channel
     */
    private async showAIResponse(response: string): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'terminaiResponse',
            'TerminAI Response',
            vscode.ViewColumn.Beside,
            {}
        );

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
    private async showCodeAnalysis(analysis: string): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'terminaiAnalysis',
            'Code Analysis',
            vscode.ViewColumn.Beside,
            {}
        );

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
    private setupTerminalListeners(): void {
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
    private escapeHtml(unsafe: string): string {
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
    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        if (this.aiTerminal) {
            this.aiTerminal.dispose();
        }
    }
}