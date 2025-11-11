"""
浏览器管理模块
处理与浏览器的连接和自动化操作
"""

import asyncio
import logging
from typing import Optional

from playwright.async_api import async_playwright, Browser, Page

logger = logging.getLogger("terminai-mcp-browser")

class BrowserManager:
    """浏览器管理器"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.playwright = None
        self.ai_urls = {
            "deepseek": "https://chat.deepseek.com",
            "qwen": "https://qianwen.aliyun.com/chat", 
            "doubao": "https://www.doubao.com/chat"
        }
    
    async def connect(self, debug_port: int = 9222):
        """连接到已运行的浏览器实例"""
        try:
            # Use async context manager for playwright
            async with async_playwright() as playwright:
                self.playwright = playwright
                
                # 连接到已运行的浏览器
                self.browser = await self.playwright.chromium.connect_over_cdp(
                    f"http://localhost:{debug_port}"
                )
                
                # 获取或创建页面
                contexts = self.browser.contexts
                if contexts and contexts[0].pages:
                    self.page = contexts[0].pages[0]
                else:
                    self.page = await contexts[0].new_page() if contexts else await self.browser.new_page()
                
                logger.info(f"Connected to browser on port {debug_port}")
            
        except Exception as e:
            logger.error(f"Failed to connect to browser: {e}")
            await self.close()
            raise
    
    async def ask_ai(self, ai: str, question: str) -> str:
        """向指定 AI 提问并获取回答"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # 导航到对应的 AI 网站
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
        
        # 这里需要根据具体网站调整选择器
        # 以下是通用示例，实际使用时需要针对每个网站调整
        
        # 查找输入框并输入问题
        input_selectors = [
            "textarea",
            "input[type='text']",
            "[contenteditable='true']",
            ".chat-input",
            "#prompt-textarea"
        ]
        
        input_element = None
        for selector in input_selectors:
            elements = await self.page.query_selector_all(selector)
            if elements:
                # 选择最后一个（通常是最新的输入框）
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # 查找并点击发送按钮
        button_selectors = [
            "button[type='submit']",
            "button:has-text('发送')",
            "button:has-text('Send')",
            ".send-button",
            "[data-testid='send-button']"
        ]
        
        for selector in button_selectors:
            button = await self.page.query_selector(selector)
            if button:
                await button.click()
                break
        
        # 等待回答生成（这里需要根据实际情况调整等待时间和选择器）
        await self.page.wait_for_timeout(10000)
        
        # 提取回答内容
        answer_selectors = [
            ".message:last-child",
            ".response:last-child",
            ".answer:last-child",
            "[data-testid='message-answer']:last-child"
        ]
        
        for selector in answer_selectors:
            answer_element = await self.page.query_selector(selector)
            if answer_element:
                answer = await answer_element.text_content()
                if answer and answer.strip():
                    return answer.strip()
        
        return "No answer found - please check the website structure and selectors"
    
    async def switch_ai(self, ai: str):
        """切换到指定的 AI 网站"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(2000)
    
    def is_connected(self) -> bool:
        """检查浏览器是否已连接"""
        return self.browser is not None and self.browser.is_connected()
    
    async def close(self):
        """关闭浏览器连接"""
        if self.browser:
            await self.browser.close()
        # playwright is automatically closed by the async context manager
        
        self.browser = None
        self.page = None
        self.playwright = None
        logger.info("Browser connection closed")