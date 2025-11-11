import * as vscode from 'vscode';
import { TerminalManager } from './terminAIManager';
import { AIService } from './aiService';
import { ConfigurationManager } from './configurationManager';

/**
 * TerminAI VS Code Extension
 * AI-powered terminal assistant for VS Code
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('TerminAI extension is now active!');

    // Initialize services
    const configManager = new ConfigurationManager();
    const aiService = new AIService(configManager);
    const terminalManager = new TerminalManager(aiService);

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

export function deactivate() {
    console.log('TerminAI extension is now deactivated!');
}