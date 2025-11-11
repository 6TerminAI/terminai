const { testTerminAIExtension } = require('./extension.test');
const { testCommandRegistration } = require('./verifyCommands.test');
const { testCompleteExtension } = require('./completeExtension.test');

async function run() {
  // This is a simplified test runner that just runs our verification
  console.log('Starting end-to-end tests...');
  
  try {
    // Run the extension functionality verification
    await testTerminAIExtension();
    
    // Run the command registration verification
    await testCommandRegistration();
    
    // Run the complete extension functionality test
    await testCompleteExtension();
    
    console.log('✅ All end-to-end tests passed!');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ End-to-End tests failed:', error);
    return Promise.reject(error);
  }
}

module.exports = {
  run
};