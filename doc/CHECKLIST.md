# Coding Checklist

This checklist is based on the hybrid HTML template approach described in html_template.md for VS Code extension development.

## Project Structure

- [x] Follow the recommended project structure:
  ```
  learning-buddy/
  ├── src/
  │   ├── extension.ts          # Main extension entry point
  │   ├── providers/
  │   │   └── ChatViewProvider.ts
  │   └── templates/           # Template modules
  │       ├── index.ts         # Main template loader
  │       ├── base.ts          # Base HTML structure
  │       └── components.ts    # Reusable UI components
  ├── media/                   # Static assets
  │   ├── chat-template.html   # Main HTML template
  │   └── styles/
  │       └── chat.css
  └── package.json
  ```
- [x] File and folder names should reflect business intention and be descriptive
- [x] Related code files should be placed under the same folder

## Template Engine Implementation

- [x] Create a singleton TemplateEngine class
- [x] Implement `renderMainTemplate()` method that:
  - [x] Reads external HTML template files
  - [x] Replaces placeholders with dynamic content
  - [x] Uses `vscode.workspace.fs.readFile()` for file reading
  - [x] Properly handles webview resource URIs with `webview.asWebviewUri()`
- [x] Create reusable component functions for UI elements
- [x] Use template literals for dynamic components in code

## HTML Template Structure

- [x] Keep main HTML structure in external `.html` files in the `media/` directory
- [x] Use placeholder syntax `{{variable_name}}` for dynamic content
- [x] Separate static structure from dynamic content
- [x] Include proper meta tags:
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

## Component Templates

- [x] Create separate component functions for reusable UI elements
- [x] Use template literals for component generation
- [x] Pass data as parameters to component functions
- [x] Return HTML strings from component functions
- [x] Example components:
  - [x] Contact lists
  - [x] Message bubbles
  - [x] Input areas
  - [x] Welcome messages

## Webview Provider Implementation

- [x] Implement `resolveWebviewView()` method properly
- [x] Set webview options:
  ```typescript
  webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
          vscode.Uri.joinPath(this._extensionUri, 'media')
      ]
  };
  ```
- [x] Use the template engine to generate HTML content
- [x] Set up message handling with `webview.onDidReceiveMessage()`
- [x] Implement data fetching methods for dynamic content

## Placeholder Replacement

- [x] Use consistent placeholder syntax `{{variable_name}}`
- [x] Replace placeholders with actual values before rendering
- [x] Handle missing data gracefully
- [x] Escape HTML content when necessary

## JavaScript Implementation

- [x] Keep core application logic in external JavaScript
- [x] Use event delegation for dynamic elements
- [x] Implement proper error handling
- [x] Add console logging for debugging
- [x] Use proper DOM ready checks:
  ```javascript
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeComponents);
  } else {
      setTimeout(initializeComponents, 100);
  }
  ```

## CSS Styling

- [x] Keep CSS in separate files in the `media/styles/` directory
- [x] Link CSS files properly in HTML templates
- [x] Use VS Code CSS variables for consistency:
  ```css
  --vscode-editor-background
  --vscode-editor-foreground
  --vscode-button-background
  ```

## Performance Considerations

- [x] Minimize DOM manipulation
- [x] Cache template files when possible
- [x] Use efficient placeholder replacement
- [x] Avoid unnecessary re-renders

## Type Safety

- [x] Use TypeScript interfaces for data structures
- [x] Define proper types for template data
- [x] Use type checking for component parameters
- [x] Implement proper error handling for missing data

## Maintainability

- [x] Keep static HTML in files, dynamic components in code
- [x] Use clear, descriptive names for components
- [x] Document complex template logic
- [x] Separate concerns between structure, style, and behavior

## Testing Requirements

- [x] Unit tests for every feature and update before build & package
- [x] Test webview functionality in isolation
- [x] Verify all UI components render correctly
- [x] Test all user interactions (clicks, drags, inputs)
- [x] Verify message passing between extension and webview
- [x] Test with different screen sizes and VS Code themes
- [x] Test iframe loading for all supported websites
- [x] Verify splitter/resize functionality works properly
- [x] Test hover functionality (title attributes, tooltips)
- [x] Validate Content Security Policy doesn't block legitimate content
- [x] Test error handling for network issues
- [x] Verify all configuration options work as expected
- [x] Run automated test suite with `npm test` or equivalent
- [x] Test cross-platform compatibility (Windows, macOS, Linux)
- [x] Verify extension doesn't cause memory leaks or performance issues

## Integration Testing
- [x] Auto install/uninstall extension using VS Code "code" command to verify real functionality:
  - [x] Package extension with `vsce package` or `npm run package`
  - [x] Install extension using `code --install-extension <extension-file>.vsix`
  - [x] Verify extension functionality in VS Code
  - [x] Uninstall extension using `code --uninstall-extension <publisher>.<extension-name>`
- [x] Run automated integration tests to verify extension components:
  - [x] Verify all course data is present in source code
  - [x] Validate package.json configuration
  - [x] Manually verify UI elements in VS Code as documented
  - [x] Run end-to-end tests with `npm run test:e2e` to verify real VS Code integration
- [x] Perform real behavior verification by installing and testing the extension in a clean VS Code environment using the `code` command:
  - [x] Package the extension using `npm run package`
  - [x] Install the extension using `code --install-extension learning-primer-buddy-0.0.1.vsix`
  - [x] Launch VS Code and verify all extension features work correctly in a real environment
  - [x] Test the My Courses view displays exactly 10 courses with correct titles and progress
  - [x] Verify the Podman Environment section appears correctly
  - [x] Test all extension commands and UI interactions
  - [x] Uninstall the extension using `code --uninstall-extension learning-primer-buddy-dev.learning-primer-buddy`
  - [x] Confirm the extension is completely removed and VS Code returns to its original state
  - [x] Run automated end-to-end tests using `npm run test:e2e` to verify complete extension lifecycle

## Other Testing Requirements
- [x] Test with extension disabled/enabled scenarios
- [x] When writing terminal commands, use Git Bash syntax and paths (not PowerShell) for cross-platform compatibility