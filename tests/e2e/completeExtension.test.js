/**
 * End-to-End Test: Complete Extension Functionality
 * 
 * This test verifies that the complete TerminAI extension works correctly
 * by testing the entire workflow from activation to command execution.
 */

const vscode = require('vscode');

async function testCompleteExtension() {
    console.log('=== Complete TerminAI Extension End-to-End Test ===\n');
    
    try {
        // Get the extension
        const extension = vscode.extensions.getExtension('TerminAI.terminai');
        if (!extension) {
            throw new Error('TerminAI extension not found');
        }

        // Activate the extension if not already active
        if (!extension.isActive) {
            await extension.activate();
            console.log('✅ Extension activated');
        } else {
            console.log('✅ Extension already active');
        }

        // Verify the extension is working
        if (extension.isActive) {
            console.log('✅ Extension is active and running');
            
            // Test 1: Verify all commands are registered
            console.log('\n1. Verifying all commands are registered...');
            const commands = await vscode.commands.getCommands(true);
            const requiredCommands = [
                'terminai.openTerminal'
            ];
            
            let allCommandsFound = true;
            for (const command of requiredCommands) {
                const hasCommand = commands.includes(command);
                if (!hasCommand) {
                    console.error(`❌ Command not registered: ${command}`);
                    allCommandsFound = false;
                } else {
                    console.log(`✅ Found command: ${command}`);
                }
            }
            
            if (!allCommandsFound) {
                throw new Error('Not all required commands are registered');
            }
            console.log('✅ All required commands are registered');
            
            // Test 2: Execute the main commands
            console.log('\n2. Executing main command...');
            
            // Execute openTerminal command
            try {
                await vscode.commands.executeCommand('terminai.openTerminal');
                console.log('✅ Open terminal command executed successfully');
            } catch (error) {
                console.error('❌ Open terminal command failed:', error.message);
                throw error;
            }
            
            console.log('\n🎉 Complete TerminAI Extension End-to-End Test PASSED!');
            console.log('\nSummary of verified functionality:');
            console.log('- Extension activates successfully');
            console.log('- All required commands are properly registered');
            console.log('- Open terminal command executes without errors');
            
            return true;
        } else {
            throw new Error('Extension failed to activate');
        }
    } catch (error) {
        console.error('❌ Complete TerminAI Extension End-to-End Test FAILED:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify that the extension name in package.json matches the expected ID');
        console.log('2. Verify that all commands are registered in extension.ts');
        console.log('3. Check that the extension activates correctly');
        console.log('4. Ensure all required dependencies are available');
        
        return false;
    }
}

// Run the test if called directly
if (require.main === module) {
    testCompleteExtension().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution error:', error);
        process.exit(1);
    });
}

module.exports = { testCompleteExtension };