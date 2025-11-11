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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
// Mocha test suite
describe('TerminAI Extension Test Suite', function () {
    before(function () {
        vscode.window.showInformationMessage('Start all tests.');
    });
    it('Extension should be present', function () {
        assert.ok(vscode.extensions.getExtension('your-publisher-name.terminai'));
    });
    it('Commands should be registered', async function () {
        const commands = await vscode.commands.getCommands(true);
        const terminaiCommands = commands.filter(cmd => cmd.startsWith('terminai.'));
        assert.ok(terminaiCommands.includes('terminai.openTerminal'));
        assert.ok(terminaiCommands.includes('terminai.executeCommand'));
        assert.ok(terminaiCommands.includes('terminai.analyzeCode'));
    });
});
//# sourceMappingURL=extension.test.js.map