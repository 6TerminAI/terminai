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
const vscode = __importStar(require("vscode"));
const extension = __importStar(require("../../src/extension"));
/**
 * Integration Test: Extension Activation
 *
 * This test verifies that the extension activates correctly and registers all commands.
 */
describe('Extension Activation Integration', () => {
    let mockContext;
    beforeEach(() => {
        // Create a mock context
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn().mockReturnValue([]),
                update: jest.fn().mockResolvedValue(undefined)
            },
            extensionPath: '/test/path',
            extensionUri: {}
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should activate the extension without errors', async () => {
        // Test extension activation
        const activatePromise = extension.activate(mockContext);
        // Should not throw any errors
        await expect(activatePromise).resolves.not.toThrow();
        // Verify the extension context was properly handled
        expect(mockContext.subscriptions.length).toBeGreaterThan(0);
    });
    it('should register all required commands during activation', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        // Verify commands are registered (this is tested through the mock)
        const registerCommandMock = vscode.commands.registerCommand;
        const registeredCommands = registerCommandMock.mock.calls.map(call => call[0]);
        // Check that required commands are present
        expect(registeredCommands).toContain('terminai.openTerminal');
    });
});
//# sourceMappingURL=extensionActivation.integration.test.js.map