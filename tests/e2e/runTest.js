const { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runTests } = require('@vscode/test-electron');
const { execSync } = require('child_process');
const path = require('path');

async function main() {
  try {
    // 1. Download and unzip a standalone VS Code for testing (latest version)
    const vscodeExecutablePath = await downloadAndUnzipVSCode('1.105.1');

    // 2. Get the path to the CLI utility
    const [cliPath] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // 3. Package the extension
    console.log('Packaging extension...');
    execSync('npm run package', {
      encoding: 'utf-8',
      stdio: 'inherit'
    });

    // 4. Install your extension (.vsix file)
    const projectRoot = path.resolve(__dirname, '..', '..');
    const vsixPath = path.join(projectRoot, 'terminai-0.1.0.vsix');
    
    console.log(`Installing extension from ${vsixPath}...`);
    execSync(`${cliPath} --install-extension "${vsixPath}"`, {
      encoding: 'utf-8',
      stdio: 'inherit'
    });

    // 5. Run the actual test suite
    const exitCode = await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath: path.resolve(__dirname, '..', '..'),
      extensionTestsPath: path.resolve(__dirname, './suite/index.js'),
      launchArgs: ['--disable-extensions'] // Disable other extensions for a clean slate
    });

    process.exit(exitCode);

  } catch (err) {
    console.error('Failed to run tests', err);
    process.exit(1);
  }
}

main();