"""
Browser management module
Handles connection to browser and automation operations
"""

import asyncio
import logging
from typing import Optional

from playwright.async_api import async_playwright, Browser, Page

logger = logging.getLogger("terminai-mcp-browser")

class BrowserManager:
    """Browser manager"""
    
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
        """Connect to the running browser instance"""
        try:
            # Use async context manager for playwright
            async with async_playwright() as playwright:
                self.playwright = playwright
                
                # Connect to the running browser
                self.browser = await self.playwright.chromium.connect_over_cdp(
                    f"http://localhost:{debug_port}"
                )
                
                # Get or create page
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
        """Ask the specified AI and get the response"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        # Navigate to the corresponding AI website
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(3000)
        
        # The selectors need to be adjusted according to specific websites
        # The following are general examples, actual use needs to be adjusted for each website
        
        # Find input box and input question
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
                # Select the last one (usually the latest input box)
                input_element = elements[-1]
                break
        
        if not input_element:
            raise RuntimeError("Could not find input element")
        
        await input_element.fill(question)
        await self.page.wait_for_timeout(1000)
        
        # Find and click the send button
        button_selectors = [
            "button[type='submit']",
            "button:has-text('发送')",  # 'Send' button in Chinese
            "button:has-text('Send')",
            ".send-button",
            "[data-testid='send-button']"
        ]
        
        for selector in button_selectors:
            button = await self.page.query_selector(selector)
            if button:
                await button.click()
                break
        
        # Wait for response generation (need to adjust wait time and selectors according to actual situation)
        await self.page.wait_for_timeout(10000)
        
        # Extract response content
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
        """Switch to the specified AI website"""
        if not self.page:
            raise RuntimeError("Browser page not available")
        
        url = self.ai_urls.get(ai)
        if not url:
            raise ValueError(f"Unsupported AI: {ai}")
        
        await self.page.goto(url)
        await self.page.wait_for_timeout(2000)
    
    def is_connected(self) -> bool:
        """Check if browser is connected"""
        return self.browser is not None and self.browser.is_connected()
    
    async def close(self):
        """Close browser connection"""
        if self.browser:
            await self.browser.close()
        # playwright is automatically closed by the async context manager
        
        self.browser = None
        self.page = None
        self.playwright = None
        logger.info("Browser connection closed")