#!/usr/bin/env python3
"""
TerminAI MCP Server main program
Web server based on FastAPI, providing browser automation functionality
"""

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .browser import BrowserManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("terminai-mcp-server")

# Global browser manager instance
browser_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management"""
    global browser_manager
    
    # Initialize browser manager on startup
    browser_manager = BrowserManager()
    logger.info("MCP Server starting up...")
    
    yield
    
    # Clean up resources on shutdown
    if browser_manager:
        await browser_manager.close()
    logger.info("MCP Server shutting down...")

# Create FastAPI application
app = FastAPI(
    title="TerminAI MCP Server",
    description="MCP Server for browser automation in TerminAI VS Code Extension",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "TerminAI MCP Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    browser_status = "connected" if browser_manager and browser_manager.is_connected() else "disconnected"
    
    return {
        "status": "healthy",
        "browser": browser_status,
        "timestamp": asyncio.get_event_loop().time()
    }

@app.post("/init")
async def init_browser(debug_port: int = 9222):
    """Initialize browser connection"""
    try:
        await browser_manager.connect(debug_port)
        return {"success": True, "message": "Browser connected successfully"}
    except Exception as e:
        logger.error(f"Failed to connect to browser: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(ai: str, question: str):
    """Ask question to the specified AI"""
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
    """Get supported AI list"""
    return {
        "ais": ["deepseek", "qwen", "doubao"],
        "default": "deepseek"
    }

@app.post("/switch")
async def switch_ai(ai: str):
    """Switch to the specified AI"""
    if not browser_manager or not browser_manager.is_connected():
        raise HTTPException(status_code=400, detail="Browser not connected")
    
    try:
        await browser_manager.switch_ai(ai)
        return {"success": True, "message": f"Switched to {ai}"}
    except Exception as e:
        logger.error(f"Failed to switch AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def main():
    """Main function"""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)

if __name__ == "__main__":
    main()