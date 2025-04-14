# GitHub Actions Workflows

This directory contains GitHub Actions workflow configurations for automated testing and deployment.

## Workflow: `deploy.yml`

This workflow executes a complete CI/CD process that includes testing, building, and deploying to GitHub Pages when changes are pushed to the `main` branch.

The workflow follows these steps in sequence:

### 1. Testing Phase
- Uses pnpm for faster dependency management
- Implements test results caching for better performance
- Installs dependencies
- Runs unit tests
- Performs type checking

### 2. Build and Deploy Phase
- Only runs if all tests pass
- Automatically extracts the repository name to use as the base path
- Uses pnpm for faster dependency management
- Dynamically updates the Vite configuration with the current repository name
- Implements build artifact caching for faster deployments
- Builds the frontend application
- Deploys the built files to the `gh-pages` branch using the JamesIves/github-pages-deploy-action

## Performance Optimizations

- **pnpm** is used instead of npm for faster installations and efficient disk space usage
- **Caching strategy** implemented for:
  - Node modules (via pnpm cache)
  - Build artifacts
  - Test results
- Hash-based cache keys ensure proper cache invalidation when source files change
- Sequential pipeline design prevents building code that fails tests
- **Automatic configuration** adapts the base path to the current repository name

## GitHub Pages Setup

To finalize the GitHub Pages deployment setup:

1. Go to your repository settings
2. Navigate to the "Pages" section
3. Under "Build and deployment" > "Source", select "Deploy from a branch"
4. In "Branch", select the `gh-pages` branch and the root folder (/)
5. Click "Save"

The deployed application will be available at: `https://{username}.github.io/{repository-name}/` 
