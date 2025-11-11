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
const configurationManager_1 = require("../../src/configurationManager");
const vscode = __importStar(require("vscode"));
// Mock the VS Code API
jest.mock('vscode', () => {
    return {
        workspace: {
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        }
    };
});
describe('ConfigurationManager', () => {
    let configurationManager;
    beforeEach(() => {
        configurationManager = new configurationManager_1.ConfigurationManager();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should create ConfigurationManager instance', () => {
        expect(configurationManager).toBeInstanceOf(configurationManager_1.ConfigurationManager);
    });
    test('should have getAPIKey method', () => {
        expect(typeof configurationManager.getAPIKey).toBe('function');
    });
    test('should have setAPIKey method', () => {
        expect(typeof configurationManager.setAPIKey).toBe('function');
    });
    test('should return null when API key is not set', () => {
        const getMock = vscode.workspace.getConfiguration.mockReturnValue({
            get: jest.fn().mockReturnValue(undefined)
        });
        const apiKey = configurationManager.getAPIKey();
        expect(apiKey).toBeNull();
    });
    test('should return API key when set', () => {
        const getMock = vscode.workspace.getConfiguration.mockReturnValue({
            get: jest.fn().mockReturnValue('test-api-key')
        });
        const apiKey = configurationManager.getAPIKey();
        expect(apiKey).toBe('test-api-key');
    });
});
//# sourceMappingURL=configurationManager.test.js.map