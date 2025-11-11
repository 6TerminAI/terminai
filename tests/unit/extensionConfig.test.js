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
// Mock VS Code API
jest.mock('vscode', () => {
    return {
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        },
        commands: {
            registerCommand: jest.fn()
        },
        workspace: {
            registerTextDocumentContentProvider: jest.fn(),
            openTextDocument: jest.fn().mockResolvedValue({}),
            showTextDocument: jest.fn().mockResolvedValue({}),
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        },
        ExtensionContext: jest.fn(),
        globalState: {
            get: jest.fn(),
            update: jest.fn()
        },
        Uri: {
            parse: jest.fn().mockReturnValue({ toString: () => 'mock-uri' })
        }
    };
});
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
describe('Extension Configuration Validation', () => {
    describe('Package.json validation', () => {
        let packageJson;
        beforeEach(() => {
            const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
            packageJson = JSON.parse(packageJsonContent);
        });
        it('should have correct extension name', () => {
            expect(packageJson.name).toBe('terminai');
        });
        it('should have correct activation events', () => {
            expect(Array.isArray(packageJson.activationEvents)).toBe(true);
            expect(packageJson.activationEvents).toContain('onCommand:terminai.openTerminal');
        });
        it('should have all required commands registered', () => {
            const commands = packageJson.contributes.commands;
            const commandIds = commands.map((cmd) => cmd.command);
            expect(commandIds).toContain('terminai.openTerminal');
        });
        it('should have correct command configurations', () => {
            const commands = packageJson.contributes.commands;
            const openTerminalCommand = commands.find((cmd) => cmd.command === 'terminai.openTerminal');
            expect(openTerminalCommand).toBeDefined();
            expect(openTerminalCommand.title).toBe('TerminAI: Open AI Terminal');
            expect(openTerminalCommand.category).toBe('TerminAI');
        });
        it('should have correct menu configurations', () => {
            // Check for keybindings
            expect(Array.isArray(packageJson.contributes.keybindings)).toBe(true);
            const keybinding = packageJson.contributes.keybindings[0];
            expect(keybinding.command).toBe('terminai.openTerminal');
        });
    });
});
//# sourceMappingURL=extensionConfig.test.js.map