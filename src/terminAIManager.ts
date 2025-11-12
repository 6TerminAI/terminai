import * as vscode from 'vscode';
import { PodmanManager } from './podmanManager';
import { ChromeManager } from './chromeManager';

export class TerminAIWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'terminai.terminalView';
    private webviewView?: vscode.WebviewView;
    private podmanManager: PodmanManager;
    private chromeManager: ChromeManager;
    private currentAI: string = 'deepseek'; // Default AI service
    private commandHistory: string[] = [];
    private historyIndex: number = -1;

    constructor(private extensionUri: vscode.Uri) {
        this.podmanManager = new PodmanManager();
        this.chromeManager = new ChromeManager();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webviewView = webviewView;

        webviewView.webview.options = {

            enableScripts: true

        };

        webviewView.webview.html = this.getWebviewContent();

        webviewView.webview.onDidReceiveMessage((data) => {
            this.handleMessage(data);
        });

        // Initialize Podman and browser on startup
        this.initializeServices();
    }

    private async initializeServices() {
        if (this.webviewView) {
            this.postMessage({ type: 'output', content: '🚀 TerminAI starting up...\n' });
            
            try {
                // Start Chrome browser with debug port
                this.postMessage({ type: 'output', content: '🌐 Starting Chrome browser...\n' });
                const debugPort = await this.chromeManager.startChrome();
                this.postMessage({ type: 'output', content: `✅ Chrome started on debug port ${debugPort}\n` });
                
                // Start Podman container with Chrome debug port
                this.postMessage({ type: 'output', content: '🐳 Starting Podman container...\n' });
                await this.podmanManager.startContainer(debugPort);
                this.postMessage({ type: 'output', content: '✅ Podman container started\n' });
                
                this.postMessage({ 
                    type: 'output', 
                    content: `🤖 TerminAI ready! Current AI: ${this.currentAI}\nType 'help' to see available commands\n\nTerminAI:${this.currentAI}$ ` 
                });
            } catch (error) {
                this.postMessage({ 
                    type: 'output', 
                    content: `❌ Initialization failed: ${error}\n` 
                });
                
                // Clean up resources on failure
                await this.cleanupResources();
            }
        }
    }

    private async cleanupResources() {
        try {
            await this.podmanManager.dispose();
            await this.chromeManager.stopChrome();
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }



    private async handleMessage(data: any) {
        switch (data.type) {
            case 'command':
                await this.handleCommand(data.command);
                break;
            case 'keydown':
                if (data.key === 'Enter') {
                    await this.handleCommand(data.input);
                } else if (data.key === 'ArrowUp') {
                    this.handleHistoryNavigation('up');
                } else if (data.key === 'ArrowDown') {
                    this.handleHistoryNavigation('down');
                }
                break;
        }
    }

    private async handleCommand(command: string) {
        if (!command.trim()) {
            this.addPrompt();
            return;
        }

        // Add to command history
        this.commandHistory.push(command);
        if (this.commandHistory.length > 100) { // Limit history record count
            this.commandHistory.shift();
        }
        this.historyIndex = this.commandHistory.length; // Reset history index

        // Display user input command
        this.postMessage({ type: 'command', content: command });

        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                await this.listAIs(args.slice(1));
                break;
            case 'cd':
                await this.changeAI(args[1]);
                break;
            case 'qi':
                await this.askQuestion(args.slice(1).join(' '));
                break;
            case 'status':
                await this.showStatus();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            default:
                this.postMessage({ 
                type: 'output', 
                content: `❌ Unknown command: ${cmd}\nType 'help' to see available commands\n` 
            });
        }

        this.addPrompt();
    }

    private handleHistoryNavigation(direction: 'up' | 'down') {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.postMessage({ 
                type: 'setInput', 
                command: this.commandHistory[this.historyIndex] 
            });
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.postMessage({ 
                type: 'setInput', 
                command: this.commandHistory[this.historyIndex] 
            });
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.postMessage({ 
                type: 'setInput', 
                command: '' 
            });
        }
    }

    private showHelp() {
        const helpText = `
📖 TerminAI Command Help:

Basic Commands:
  cd <ai>       Switch current AI (deepseek, qwen, doubao)
  ls [-l]       List all supported AIs (use -l for detailed view)
  qi <question> Ask current AI a question
  status        Check system status
  clear         Clear terminal

System Commands:
  help          Display this help

Tips:
• After switching AI, the system will automatically navigate to the corresponding chat page
• Please wait patiently for AI to generate answers when asking questions
• Ensure the browser remains open
        `;
        this.postMessage({ type: 'output', content: helpText });
    }

    private async listAIs(args: string[] = []) {
        const detailed = args.includes('-l') || args.includes('--long');
        
        try {
            // Call MCP server API to get supported AI services
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse('http://localhost:3000/ais');
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                }, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.end();
            });
            
            const response = await responsePromise;
            
            if (!(response as any).ok) {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
            
            const responseData = (response as any).data;
            const aiServices = responseData.ais || {};
            
            if (detailed) {
                // Create detailed listing
                let output = 'Detailed AI Services List:\n';
                output += '==========================\n';
                output += 'ID              Name                 Category      URL\n';
                output += '--------------- -------------------- ------------- ------------------------------------------\n';
                
                let index = 1;
                for (const [serviceId, serviceInfo] of Object.entries(aiServices)) {
                    const service = serviceInfo as any;
                    const category = service.category || 'Unknown';
                    output += `${serviceId.padEnd(15)} ${(service.name || serviceId).padEnd(20)} ${category.padEnd(13)} ${service.url || 'N/A'}\n`;
                    index++;
                }
                
                this.postMessage({ 
                    type: 'output', 
                    content: output 
                });
            } else {
                // Simple listing
                const serviceNames = Object.keys(aiServices);
                const aiList = serviceNames.join(', ');
                this.postMessage({ 
                    type: 'output', 
                    content: `Supported AI services: ${aiList}\n` 
                });
            }
            
        } catch (error) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Failed to get AI services list: ${error}\n` 
            });
        }
    }

    private async changeAI(aiName?: string) {
        if (!aiName) {
            this.postMessage({ 
                type: 'output', 
                content: '❌ Please specify the AI service to switch to\n' 
            });
            return;
        }

        const supportedAIs = ['deepseek', 'qwen', 'doubao', 'chatgpt'];
        if (!supportedAIs.includes(aiName.toLowerCase())) {
            this.postMessage({ 
                type: 'output', 
                content: `❌ Unsupported AI service: ${aiName}\n` 
            });
            return;
        }

        this.currentAI = aiName.toLowerCase();
        
        // Notify MCP server to switch websites
        try {
            // Use node's http module instead of fetch
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse(`http://localhost:3000/switch-ai`);
            const postData = JSON.stringify({
                aiName: this.currentAI
            });
            
            const options = {
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'content-length': Buffer.byteLength(postData)
                    }
                };
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(postData);
                req.end();
            });
            
            const response = await responsePromise;
            
            if ((response as any).ok) {
                const data = (response as any).data;
                
                if (data.success) {
                    this.postMessage({ 
                            type: 'output', 
                            content: `✅ Switched to ${this.currentAI}\n` 
                        });
                } else {
                    this.postMessage({ 
                            type: 'output', 
                            content: `❌ Failed to switch AI: ${data.error}\n` 
                        });
                }
            } else {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
        } catch (error) {
            this.postMessage({ 
                    type: 'output', 
                    content: `❌ Failed to switch AI: ${error}\n` 
                });
        }
    }

    private async askQuestion(question: string) {
        if (!question) {
            this.postMessage({ 
                type: 'output', 
                content: '❌ Please enter a question to ask\n' 
            });
            return;
        }

        this.postMessage({ 
            type: 'output', 
            content: `[${this.currentAI}] Asking: ${question}\n` 
        });

        try {
            // Use node's http module instead of fetch
            const http = await import('http');
            const url = await import('url');
            
            const requestUrl = url.parse(`http://localhost:3000/ask`);
            const postData = JSON.stringify({
                question: question,
                aiName: this.currentAI
            });
            
            const options = {
                    hostname: requestUrl.hostname,
                    port: requestUrl.port ? parseInt(requestUrl.port) : 3000,
                    path: requestUrl.path,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'content-length': Buffer.byteLength(postData)
                    }
                };
            
            const responsePromise = new Promise((resolve, reject) => {
                const req = http.request(options, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            resolve({ ok: res.statusCode === 200, status: res.statusCode, data: response });
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(postData);
                req.end();
            });
            
            const response = await responsePromise;
            
            if ((response as any).ok) {
                const data = (response as any).data;
                
                if (data.success) {
                    this.postMessage({ 
                            type: 'output', 
                            content: `[${this.currentAI}] Answer: ${data.answer}\n` 
                        });
                } else {
                    this.postMessage({ 
                            type: 'output', 
                            content: `❌ Failed to get answer: ${data.error}\n` 
                        });
                }
            } else {
                throw new Error(`HTTP error! status: ${(response as any).status}`);
            }
        } catch (error) {
            this.postMessage({ 
                    type: 'output', 
                    content: `❌ Failed to get answer: ${error}\n` 
                });
        }
    }

    private async showStatus() {
        const status = `
📊 System Status:
• Current AI: ${this.currentAI}
    • Podman: ${await this.podmanManager.isContainerRunning() ? 'Running' : 'Stopped'}
        `;
        this.postMessage({ type: 'output', content: status });
    }

    private clearTerminal() {
        this.postMessage({ type: 'clear' });
    }

    private addPrompt() {
        this.postMessage({ 
            type: 'output', 
            content: `TerminAI:${this.currentAI}$ ` 
        });
    }

    private postMessage(message: any) {
        if (this.webviewView) {
            this.webviewView.webview.postMessage(message);
        }
    }

    private getWebviewContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TerminAI Terminal</title>
            <style>
                body {
                    margin: 0;
                    padding: 10px;
                    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    height: 100vh;
                    overflow: hidden;
                }
                
                #terminal {
                    height: calc(100vh - 80px);
                    overflow-y: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    line-height: 1.4;
                    padding: 5px;
                }
                
                .prompt {
                    color: #4ec9b0;
                }
                
                .command {
                    color: #dcdcaa;
                }
                
                .output {
                    color: #d4d4d4;
                }
                
                .input-line {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
                
                #command-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #d4d4d4;
                    font-family: 'Cascadia Code', 'Consolas', 'Courier New', monospace;
                    font-size: 14px;
                    outline: none;
                    padding: 0 5px;
                    line-height: 1.4;
                }
                
                .response {
                    color: #ce9178;
                }
                
                .error {
                    color: #f48771;
                }
            </style>
        </head>
        <body>
            <div id="terminal"></div>
            <div class="input-line">
                <span id="prompt" class="prompt">TerminAI:loading$ </span>
                <input type="text" id="command-input" autocomplete="off" autofocus>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                const terminal = document.getElementById('terminal');
                const commandInput = document.getElementById('command-input');
                const promptSpan = document.getElementById('prompt');
                
                let currentPrompt = 'TerminAI:loading$ ';
                
                // Scroll to bottom
                function scrollToBottom() {
                    terminal.scrollTop = terminal.scrollHeight;
                }
                
                // Output content to terminal
                function outputToTerminal(content) {
                    if (typeof content === 'string') {
                        const outputElement = document.createElement('div');
                        outputElement.className = 'output';
                        outputElement.textContent = content;
                        terminal.appendChild(outputElement);
                    }
                    scrollToBottom();
                }
                
                // Add command to terminal
                function addCommandToTerminal(command) {
                    const commandElement = document.createElement('div');
                    commandElement.className = 'command';
                    commandElement.textContent = currentPrompt + command;
                    terminal.appendChild(commandElement);
                    scrollToBottom();
                }
                
                // Update prompt
                function updatePrompt(ai) {
                    currentPrompt = 'TerminAI:' + ai + '$ ';
                    promptSpan.textContent = currentPrompt;
                }
                
                // Clear terminal
                function clearTerminal() {
                    terminal.innerHTML = '';
                }
                
                // Set input box content
                function setInput(value) {
                    commandInput.value = value;
                    commandInput.focus();
                }
                
                // VS Code message handling
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'output':
                            outputToTerminal(message.content);
                            break;
                        case 'command':
                            addCommandToTerminal(message.content);
                            break;
                        case 'clear':
                            clearTerminal();
                            break;
                        case 'setInput':
                            setInput(message.command);
                            break;
                        case 'updatePrompt':
                            updatePrompt(message.ai);
                            break;
                    }
                });
                
                // Command input handling
                commandInput.addEventListener('keydown', event => {
                    // Send message to VS Code extension
                    vscode.postMessage({
                        type: 'keydown',
                        key: event.key,
                        input: commandInput.value
                    });
                    
                    if (event.key === 'Enter') {
                        // Send command to VS Code extension
                        vscode.postMessage({
                            type: 'command',
                            command: commandInput.value
                        });
                        
                        commandInput.value = '';
                        event.preventDefault();
                    }
                });
                
                // Initial focus
                commandInput.focus();
            </script>

        </body>

        </html>`;

    }



    /**

     * Dispose of the provider

     */

    public dispose(): void {

        // Clean up resources if needed

        if (this.podmanManager) {

            this.podmanManager.dispose();

        }

    }

}