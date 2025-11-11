import { ConfigurationManager } from '../../src/configurationManager';
import * as vscode from 'vscode';

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
    let configurationManager: ConfigurationManager;

    beforeEach(() => {
        configurationManager = new ConfigurationManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create ConfigurationManager instance', () => {
        expect(configurationManager).toBeInstanceOf(ConfigurationManager);
    });

    test('should have getAPIKey method', () => {
        expect(typeof configurationManager.getAPIKey).toBe('function');
    });

    test('should have setAPIKey method', () => {
        expect(typeof configurationManager.setAPIKey).toBe('function');
    });

    test('should return null when API key is not set', () => {
        const getMock = (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(undefined)
        });
        
        const apiKey = configurationManager.getAPIKey();
        expect(apiKey).toBeNull();
    });
    
    test('should return API key when set', () => {
        const getMock = (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue('test-api-key')
        });
        
        const apiKey = configurationManager.getAPIKey();
        expect(apiKey).toBe('test-api-key');
    });
});