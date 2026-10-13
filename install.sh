#!/usr/bin/env bash
# Symlink every skill in ./skills into ~/.claude/skills (Claude Code picks them up live).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$HOME/.claude/skills"
for s in "$here"/skills/*/; do
  n="$(basename "$s")"; t="$HOME/.claude/skills/$n"
  if [ -e "$t" ] && [ ! -L "$t" ]; then echo "skip $n: $t exists and is not a symlink"; continue; fi
  ln -sfn "${s%/}" "$t" && echo "linked $n -> ${s%/}"
done
# Retired skills, replaced by scalar-forge: drop their links (never a real directory).
for n in scalar-product scalar-screen; do
  t="$HOME/.claude/skills/$n"
  if [ -L "$t" ]; then rm "$t" && echo "removed retired $n link"; fi
done
