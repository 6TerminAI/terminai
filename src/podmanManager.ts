export class PodmanManager {
    async startMCPServer(browserDebugPort: number): Promise<{ mcpPort: number; containerId: string }> {
        const mcpPort = await this.findAvailablePort();
        
        // 构建镜像（如果尚未构建）
        await this.buildImageIfNeeded();
        
        // 启动容器
        const containerId = await this.runContainer(mcpPort);
        await this.waitForMCPServerReady(mcpPort);
        
        // 初始化浏览器连接
        await this.initializeBrowserConnection(mcpPort, browserDebugPort);
        
        return { mcpPort, containerId };
    }
    
    private async initializeBrowserConnection(mcpPort: number, browserDebugPort: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:${mcpPort}/init?debug_port=${browserDebugPort}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to initialize browser connection: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to initialize browser connection:', error);
            throw error;
        }
    }
}