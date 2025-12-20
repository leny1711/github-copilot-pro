# GitHub Copilot Instructions

This file provides custom instructions for GitHub Copilot to help maintain code quality and consistency throughout this repository.

## Project Overview

This repository is for GitHub Copilot Pro - a project to demonstrate and utilize GitHub Copilot capabilities effectively.

## Coding Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow language-specific best practices and conventions
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Add comments only when necessary to explain complex logic

### Code Style
- Use consistent indentation (prefer spaces over tabs)
- Follow language-specific linting rules
- Keep lines to a reasonable length (typically 80-120 characters)
- Use proper formatting and whitespace

## Testing

### Test Requirements
- Write tests for all new features and bug fixes
- Ensure tests are clear and well-documented
- Test edge cases and error conditions
- Maintain or improve code coverage with each change

### Testing Best Practices
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Keep tests independent and isolated
- Avoid testing implementation details

## Security

### Security Best Practices
- Never commit secrets, API keys, or sensitive data
- Validate all user input
- Use secure defaults for all configurations
- Follow the principle of least privilege
- Keep dependencies up to date

## Documentation

### Documentation Guidelines
- Maintain up-to-date README files
- Document public APIs and interfaces
- Include usage examples where appropriate
- Keep inline documentation concise and relevant
- Update documentation when changing functionality

## Version Control

### Commit Guidelines
- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Reference related issues in commit messages
- Follow conventional commit format when applicable

## Code Review

### Review Process
- All code changes should be reviewed before merging
- Address review comments promptly
- Ensure CI/CD checks pass before requesting review
- Test changes locally before pushing

## Dependencies

### Managing Dependencies
- Keep dependencies minimal and well-justified
- Use specific versions rather than ranges when possible
- Review dependencies for security vulnerabilities
- Document any non-standard dependencies

## Best Practices for Working with Copilot

### Effective Prompts
- Be specific about requirements and constraints
- Provide context about the problem being solved
- Reference related code or files when relevant
- Ask for explanations when needed

### Quality Assurance
- Always review generated code before accepting
- Test generated code thoroughly
- Ensure generated code follows project conventions
- Validate that generated code is secure

## Additional Notes

- This repository follows industry best practices for software development
- When in doubt, prioritize code clarity over cleverness
- Performance optimizations should be justified and measured
- Accessibility and inclusive design should be considered in all features
