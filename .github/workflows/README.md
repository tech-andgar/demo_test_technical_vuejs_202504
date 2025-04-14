# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations for automated testing and deployment.

## Workflows

### `test.yml`

This workflow runs automatically on pushes to the `main` branch and on all pull requests to ensure the code quality and functionality.

Actions:
- Uses pnpm for faster dependency management
- Caches test results for improved performance
- Installs dependencies
- Runs unit tests
- Performs type checking

### `deploy.yml`

This workflow builds and deploys the frontend to GitHub Pages when changes are pushed to the `main` branch.

Actions:
- Uses pnpm for faster dependency management
- Implements build caching for faster deployments
- Builds the frontend application
- Configures GitHub Pages
- Deploys the built application to GitHub Pages

## Performance Optimizations

- **pnpm** is used instead of npm for faster installations and efficient disk space usage
- **Caching strategy** implemented for:
  - Node modules (via pnpm cache)
  - Build artifacts
  - Test results
- Hash-based cache keys ensure proper cache invalidation when source files change

## Setting Up GitHub Pages

To finish setting up GitHub Pages deployment:

1. Go to your repository settings
2. Navigate to the "Pages" section
3. Under "Build and deployment" > "Source", select "GitHub Actions"

The deployed application will be available at: `https://{username}.github.io/full-stack-challenge/` 
