module.exports = {
    window: {
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn(),
        showInputBox: jest.fn(),
        createOutputChannel: jest.fn().mockReturnValue({
            appendLine: jest.fn(),
            show: jest.fn()
        })
    },
    commands: {
        registerCommand: jest.fn()
    },
    workspace: {
        getConfiguration: jest.fn().mockReturnValue({
            get: jest.fn()
        })
    },
    ExtensionContext: jest.fn(),
    EventEmitter: class EventEmitter {
        constructor() {
            this.event = jest.fn();
        }
        fire() {}
    }
};