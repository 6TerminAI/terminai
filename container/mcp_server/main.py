#!/usr/bin/env python3
"""
TerminAI MCP Server 主程序
基于 FastAPI 的 Web 服务器，提供浏览器自动化功能
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .browser import BrowserManager

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("terminai-mcp-server")

# 全局浏览器管理器实例
browser_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global browser_manager
    
    # 启动时初始化浏览器管理器
    browser_manager = BrowserManager()
    logger.info("MCP Server starting up...")
    
    yield
    
    # 关闭时清理资源
    if browser_manager:
        await browser_manager.close()
    logger.info("MCP Server shutting down...")

# 创建 FastAPI 应用
app = FastAPI(
    title="TerminAI MCP Server",
    description="MCP Server for browser automation in TerminAI VS Code Extension",
    version="1.0.0",
    lifespan=lifespan
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """根端点"""
    return {
        "service": "TerminAI MCP Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """健康检查端点"""
    browser_status = "connected" if browser_manager and browser_manager.is_connected() else "disconnected"
    
    return {
        "status": "healthy",
        "browser": browser_status,
        "timestamp": asyncio.get_event_loop().time()
    }

@app.post("/init")
async def init_browser(debug_port: int = 9222):
    """初始化浏览器连接"""
    try:
        await browser_manager.connect(debug_port)
        return {"success": True, "message": "Browser connected successfully"}
    except Exception as e:
        logger.error(f"Failed to connect to browser: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(ai: str, question: str):
    """向指定 AI 提问"""
    if not browser_manager or not browser_manager.is_connected():
        raise HTTPException(status_code=400, detail="Browser not connected")
    
    try:
        answer = await browser_manager.ask_ai(ai, question)
        return {"success": True, "answer": answer}
    except Exception as e:
        logger.error(f"Failed to ask question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ais")
async def get_supported_ais():
    """获取支持的 AI 列表"""
    return {
        "ais": ["deepseek", "qwen", "doubao"],
        "default": "deepseek"
    }

@app.post("/switch")
async def switch_ai(ai: str):
    """切换到指定的 AI"""
    if not browser_manager or not browser_manager.is_connected():
        raise HTTPException(status_code=400, detail="Browser not connected")
    
    try:
        await browser_manager.switch_ai(ai)
        return {"success": True, "message": f"Switched to {ai}"}
    except Exception as e:
        logger.error(f"Failed to switch AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """主函数"""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)

if __name__ == "__main__":
    main()