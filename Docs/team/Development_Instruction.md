# Development Instructions

## 1. Protected Branch, Push, Merge, and Pull Request Policy

### 1.1 Protected Branches

- **Main Branch (`main`)**: The production-ready code. All commits must go through pull requests and require approval before merging.
- **Develop Branch (`dev`)**: The integration branch for features. Changes must be reviewed and tested before merging.
- **Feature Branches**: Developers create short-lived feature branches from `develop` for new features or bug fixes.

### 1.2 Branch Naming Conventions

- **Feature branches**: `feature/feature-name` (e.g., `feature/user-authentication`)
- **Bug fix branches**: `bugfix/issue-name` (e.g., `bugfix/login-error`)
- **Hotfix branches**: `hotfix/critical-issue` (e.g., `hotfix/security-vulnerability`)
- **Documentation branches**: `docs/description` (e.g., `docs/api-documentation`)

### 1.3 Push Policy

- Only push to your own feature branch during development.
- Never force push (`git push --force`) to protected branches.
- Always pull the latest changes before pushing: `git pull --rebase origin develop`
- Keep commits clean and logical before pushing.

### 1.4 Pull Request Policy

- Create a Pull Request (PR) when your feature is ready for review.
- PR title should be descriptive and follow the naming convention of your branch.
- Link related issues using `Closes #issue-number` or `Fixes #issue-number`
- Assign at least one reviewer from the development team.
- Ensure all CI/CD checks pass before requesting review.

### 1.5 Code Review Requirements

- Minimum 1 approval required before merging to `dev` or `main`.
- Once approved, the PR author is responsible for merging.

### 1.6 Merge Policy

- Use "Squash and merge" for feature branches to keep history clean.
- Delete the feature branch after successful merge.
- Ensure tests pass and CI/CD pipeline is green before merging.
- Do not merge if conflicts are unresolved or there are blocking issues. (it could be considerd in the setting of github-repo)

### 1.7 Merge Conflicts

- Resolve conflicts locally on your feature branch.
- Communicate with team members involved in the conflicting changes.
- After resolving, push the resolved changes and request re-review.
- Never auto-merge conflicted PRs.

---

## 2. Git-Commit Policy

### 2.1 Commit Message Format

Follow the Conventional Commits format for clarity and consistency:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature or fix
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes

**Scope (optional):**

- The affected module or component (e.g., `auth`, `api`, `ui`)

**Subject:**

- Use imperative mood: "add" instead of "added" or "adds"
- Don't capitalize the first letter
- No period (.) at the end
- Keep to 50 characters or less

### 2.2 Commit Examples

**Good commit:**

```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh when access token expires.
Tokens are refreshed using the refresh token stored in secure cookies.
```

**Good commit:**

```
fix(api): resolve null pointer exception in user service

Added null check before accessing user properties in getUserById method.
This prevents crashes when user is not found in database.
```

**Good commit:**

```
docs: update API documentation with new endpoints
```

### 2.3 Commit Restrictions

- **Do NOT commit:**
  - Sensitive data (passwords, API keys, tokens)
  - Large binary files (use Git LFS if necessary)
  - Generated files or build artifacts
  - Temporary or debug files
- **Use `.gitignore`** for files that should never be committed:
  - `node_modules/`
  - `.env` and `.env.local`
  - `dist/`, `build/`
  - etc..

## 3. Summary of Best Practices

✅ **DO:**

- Create feature branches for all new work
- Write clear, descriptive commit messages
- Keep PRs focused and reasonably sized (< 400 lines)
- Test locally before pushing
- Communicate with team members
- Delete merged branches

❌ **DON'T:**

- Commit directly to `main` or `dev` (this will be restirected)
- Force push to shared branches
- Leave PRs without responses
- Mix unrelated changes in one PR
- Commit sensitive information
- Skip CI/CD checks
