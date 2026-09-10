#!/usr/bin/env bash
# Orbit Sense — one-command GitHub export.
#
# Usage:
#   ./scripts/export-to-github.sh https://github.com/YOUR-USERNAME/YOUR-REPO.git
#
# Run this from the project root AFTER downloading the project to your machine.
# It initializes a git repo, commits everything (respecting .gitignore), and pushes to main.

set -euo pipefail

REPO_URL="${1:-}"
BRANCH="main"
COMMIT_MSG="Orbit Sense: AI-powered astronaut activity & experiment monitoring demo"

if [[ -z "$REPO_URL" ]]; then
  echo "Usage: $0 <github-repo-url>"
  echo "Example: $0 https://github.com/your-username/orbit-sense.git"
  exit 1
fi

if [[ ! -d .git ]]; then
  git init
  git add .
  git commit -m "$COMMIT_MSG"
fi

git branch -M "$BRANCH"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git push -u origin "$BRANCH"
echo "Done — pushed to $REPO_URL ($BRANCH)."
