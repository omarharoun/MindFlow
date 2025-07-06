# 🤝 Contributing to MindFlow

Thank you for your interest in contributing to MindFlow! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Git
- Basic knowledge of React Native and TypeScript

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/mindflow.git
   cd mindflow
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/mindflow.git
   ```

## 🛠️ Development Setup

### Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   yarn web
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn web` | Start web development server |
| `yarn ios` | Start iOS development server |
| `yarn android` | Start Android development server |
| `yarn type-check` | Run TypeScript type checking |
| `yarn lint` | Run ESLint for code quality |
| `yarn lint:fix` | Fix ESLint issues automatically |
| `yarn test` | Run tests |
| `yarn build` | Build for production |

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type - use proper typing
- Use strict TypeScript configuration

### React Native

- Use functional components with hooks
- Follow React Native best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Code Style

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for components and interfaces

### File Naming

- Use PascalCase for component files: `HomeDashboard.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Use kebab-case for assets: `user-avatar.png`

### Component Structure

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  title: string;
  onPress?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // styles
  },
  title: {
    // styles
  },
});
```

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Structure

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Component title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Component title="Test" onPress={onPress} />);
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation if needed
   - Follow the coding standards

4. **Test your changes**:
   ```bash
   yarn type-check
   yarn lint
   yarn test
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build or tool changes

Examples:
```
feat(dashboard): add progress tracking widget
fix(navigation): resolve tab switching issue
docs(readme): update installation instructions
```

### Submitting the PR

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub

3. Fill out the PR template:
   - Describe the changes
   - Link related issues
   - Add screenshots if UI changes
   - List any breaking changes

4. Request review from maintainers

### PR Review Process

- All PRs require at least one review
- Address review comments promptly
- Maintainers may request changes
- Once approved, maintainers will merge

## 🐛 Issue Reporting

### Before Reporting

1. Check existing issues for duplicates
2. Search the documentation
3. Try to reproduce the issue

### Issue Template

Use the issue template and provide:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, device info
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

### Bug Report Example

```markdown
## Bug Description
The progress widget doesn't update when completing tasks.

## Steps to Reproduce
1. Open the app
2. Go to Home screen
3. Complete a task
4. Check progress widget

## Expected Behavior
Progress widget should show updated completion percentage.

## Actual Behavior
Progress widget shows old percentage.

## Environment
- OS: macOS 12.0
- Browser: Chrome 96.0
- Device: Desktop

## Screenshots
[Add screenshots here]
```

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Search existing feature requests
3. Consider if it aligns with project goals

### Feature Request Template

```markdown
## Feature Description
Brief description of the requested feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Any alternative approaches considered?

## Additional Context
Any other relevant information.
```

## 📚 Documentation

### Updating Documentation

- Update README.md for user-facing changes
- Update CONTRIBUTING.md for process changes
- Add inline code documentation
- Update type definitions

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation up to date

## 🏷️ Labels and Milestones

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issues
- `priority: low`: Low priority issues

### Milestones

- Use milestones to group related issues
- Set realistic deadlines
- Update progress regularly

## 🎉 Recognition

### Contributors

- All contributors are listed in the README
- Significant contributions are highlighted
- Contributors receive recognition in releases

### Hall of Fame

- Top contributors are featured
- Special achievements are celebrated
- Community contributions are valued

## 📞 Getting Help

### Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Issues](https://github.com/yourusername/mindflow/issues)

### Community

- Join our Discord server
- Participate in discussions
- Ask questions in issues
- Share your experiences

## 🙏 Thank You

Thank you for contributing to MindFlow! Your contributions help make this project better for everyone.

---

**Happy coding! 🚀** 