import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class PodmanManager {
    private containerId: string | null = null;
    private browserProcess: any = null;
    private mcpPort: number = 3000;
    private browserDebugPort: number = 9222;

    constructor() {}

    async startContainer(): Promise<void> {
        try {
            // Check if Podman is available
            await execAsync('podman --version');
            
            // Check if TerminAI image exists
            try {
                await execAsync('podman image exists terminai-mcp-server');
            } catch {
                // If image doesn't exist, need to build (simplified here)
                vscode.window.showInformationMessage('Building TerminAI MCP server image...');
                // In actual implementation, this should build an image containing Playwright MCP server
            }
            
            // Stop any existing old containers
            try {
                await execAsync(`podman stop terminai-mcp`);
                await execAsync(`podman rm terminai-mcp`);
            } catch {
                // Ignore errors stopping non-existent containers
            }
            
            // Start new container
            const command = `podman run -d -p ${this.mcpPort}:3000 --name terminai-mcp terminai-mcp-server`;
            const result = await execAsync(command);
            this.containerId = result.stdout.trim();
            
            // Wait for container to fully start
            await this.waitForContainerReady();
        } catch (error) {
            throw new Error(`Failed to start Podman container: ${error}`);
        }
    }

    async startBrowser(): Promise<void> {
        try {
            // Determine platform-specific Chrome path
            let chromePath = '';
            const platform = process.platform;
            
            if (platform === 'win32') {
                // Windows
                const possiblePaths = [
                    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
                ];
                
                for (const path of possiblePaths) {
                    if (fs.existsSync(path)) {
                        chromePath = path;
                        break;
                    }
                }
            } else if (platform === 'darwin') {
                // macOS
                chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            } else {
                // Linux
                try {
                    chromePath = (await execAsync('which google-chrome')).stdout.trim();
                } catch {
                    chromePath = 'google-chrome';
                }
            }
            
            if (!chromePath || !fs.existsSync(chromePath.replace(/"/g, ''))) {
                // Try using system path
                chromePath = platform === 'win32' ? 'chrome' : 'google-chrome';
            }
            
            // Start Chrome browser with debugging port
            const userDataDir = path.join(vscode.workspace.rootPath || os.homedir(), '.terminai-browser');
            fs.mkdirSync(userDataDir, { recursive: true });
            
            const args = [
                `--remote-debugging-port=${this.browserDebugPort}`,
                `--user-data-dir=${userDataDir}`,
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-extensions'
            ];
            
            const fullCommand = `"${chromePath}" ${args.join(' ')}`;
            
            if (platform === 'win32') {
                this.browserProcess = exec(`start "" ${fullCommand}`, { shell: 'cmd.exe' });
            } else {
                this.browserProcess = exec(fullCommand);
            }
            
            // Wait for browser to start
            await this.waitForBrowserReady();
            
        } catch (error) {
            throw new Error(`Failed to start browser: ${error}`);
        }
    }

    async isContainerRunning(): Promise<boolean> {
        if (!this.containerId) {
            return false;
        }
        
        try {
            const result = await execAsync(`podman ps --filter id=${this.containerId} --format "{{.Status}}"`);
            return result.stdout.trim().includes('Up');
        } catch {
            return false;
        }
    }

    async isBrowserRunning(): Promise<boolean> {
        try {
            // Try to connect to browser debugging port
            const response = await fetch(`http://localhost:${this.browserDebugPort}/json/version`);
            return response.ok;
        } catch {
            return false;
        }
    }

    private async waitForContainerReady(timeout: number = 30000): Promise<void> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                if (await this.isContainerRunning()) {
                    // Additional check if MCP server in container is ready
                    try {
                        // Use node's http module instead of fetch
                        const http = await import('http');
                        
                        const options = {
                            hostname: 'localhost',
                            port: this.mcpPort,
                            path: '/health',
                            method: 'GET'
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
                            
                            req.end();
                        });
                        
                        const response = await responsePromise;
                        
                        if ((response as any).ok) {
                            const data = (response as any).data;
                            if (data.status === 'ok') {
                                return;
                            }
                        }
                    } catch (error) {
                        // Ignore errors during checking, continue waiting
                    }
                }
            } catch (error) {
                // Ignore errors during checking
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        throw new Error('Container failed to become ready within timeout');
    }

    private async waitForBrowserReady(timeout: number = 20000): Promise<void> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            if (await this.isBrowserRunning()) {
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        throw new Error('Browser failed to become ready within timeout');
    }

    async dispose(): Promise<void> {
        // Clean up resources
        if (this.containerId) {
            try {
                await execAsync(`podman stop ${this.containerId}`);
                await execAsync(`podman rm ${this.containerId}`);
            } catch (error) {
                console.error('Error stopping and removing container:', error);
            }
        }
        
        if (this.browserProcess) {
            this.browserProcess.kill();
        }
    }
}