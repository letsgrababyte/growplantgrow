# Contributing to GrowPlantGrow

Thank you for your interest in contributing to GrowPlantGrow! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version)
- **Error messages** (if any)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Use case**: Why is this feature useful?
- **Proposed solution** (if you have one)
- **Alternatives considered** (if any)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards
   - Write or update tests
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   - Use [Conventional Commits](https://www.conventionalcommits.org/) format
   - Examples:
     - `feat: add product search functionality`
     - `fix: resolve cart persistence issue`
     - `docs: update README with new features`
     - `refactor: improve component structure`

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Request review from maintainers

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for local development)

### Setup Steps

1. Fork and clone the repository
   ```bash
   git clone https://github.com/yourusername/growplantgrow.git
   cd growplantgrow
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Run database migrations
   - Use Supabase SQL Editor to run migrations

5. Start development server
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper types or `unknown`
- Enable strict mode in `tsconfig.json`
- Use interfaces for object shapes
- Use type aliases for complex types

### React/Next.js

- Use functional components with hooks
- Prefer Server Components when possible
- Use proper TypeScript types for props
- Follow Next.js App Router conventions
- Use Suspense for loading states

### Styling

- Use Tailwind CSS utility classes
- Follow the botanical theme color palette
- Ensure responsive design (mobile-first)
- Maintain consistent spacing and typography

### File Naming

- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatPrice.ts`)
- Pages: `page.tsx` or `layout.tsx` (Next.js convention)
- Types: `types.ts` or co-located with components

### Code Organization

```
src/
├── app/              # Next.js pages and routes
├── components/        # Reusable React components
├── contexts/         # React Context providers
├── lib/              # Utility functions and helpers
└── types/            # TypeScript type definitions
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add product search functionality
fix: resolve cart persistence issue
docs: update README with deployment instructions
refactor: improve component structure
```

## Testing

### Writing Tests

- Write tests for new features
- Update tests when modifying existing features
- Aim for good test coverage
- Test edge cases and error handling

### Running Tests

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
npm run test:coverage # Run with coverage report
```

## Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Document complex logic
- Keep comments up-to-date with code changes

### README Updates

- Update README.md when adding new features
- Keep installation instructions current
- Update examples and code snippets

## Review Process

1. All pull requests require review
2. Address review comments promptly
3. Maintainers will merge after approval
4. CI/CD checks must pass before merging

## Questions?

- Open a [GitHub Discussion](https://github.com/yourusername/growplantgrow/discussions)
- Check existing [Issues](https://github.com/yourusername/growplantgrow/issues)
- Contact maintainers directly

Thank you for contributing to GrowPlantGrow! 🎉





