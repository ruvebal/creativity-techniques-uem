#!/usr/bin/env bash
# gitflow.sh — integration-branch git flow for the autopilot Excellence cascade.
#
#   main ──●───────────────────────────────────────────●  (release: one --no-ff merge, professor only)
#           \ tag excellence/base                      /
#            excellence/integration ──M0──M1──…──M11──   (tags excellence/ex0 … ex11)
#                                      \   \
#                                       cascade/excellence-0, -1, …  (one phase branch each, via cascade-harness.sh)
#
# Guarantees:
#   * main (= GitHub Pages = students) is never written by automation.
#   * A phase lands only if: its exit gate passed AT the commit it lands (no code
#     changed after verification), its cold review says PASS, and every earlier
#     gate still passes on the merged result (regression).
#   * Every landing is a --no-ff merge + tag, so any phase can be rolled back.
#
# Usage (from anywhere inside the repo):
#   gitflow.sh init                 tag base, create integration branch + worktree
#   gitflow.sh sync                 merge committed main into integration (conflict = stop)
#   gitflow.sh start                sync, then open the next READY phase (delegates to cascade-harness.sh)
#   gitflow.sh land <n>             verify evidence, merge phase n, run regression, tag, flip INDEX
#   gitflow.sh rollback <n>         reset integration to the state before phase n landed
#   gitflow.sh status               tags, branches, worktrees
#   gitflow.sh release-notes        print the professor's final merge + rollback commands
#
# EXCELLENCE_PUSH=1 backs up integration, phase branches and tags to origin after
# init/land (force-with-lease on integration after rollback). main is never pushed.
set -euo pipefail

die() { echo "REFUSED: $*" >&2; exit 1; }
REPO="$(git rev-parse --show-toplevel)"
MAIN_WT="$(git -C "$REPO" worktree list --porcelain | awk '/^worktree /{print $2; exit}')"
INT_BRANCH="excellence/integration"
INT_WT="$(dirname "$MAIN_WT")/$(basename "$MAIN_WT")-integration"
REL="creativity-techniques-pedagogy/excellence"
HARNESS="${CASCADE_HARNESS:-$HOME/src/.cursor/skills/cascade-forge/scripts/cascade-harness.sh}"
g() { git -C "$INT_WT" "$@"; }
# Off-machine backup (professor decision 2026-10-04). Refuses any ref that is main.
backup_push() {
  [ "${EXCELLENCE_PUSH:-0}" = 1 ] || return 0
  local ref
  for ref in "$@"; do case "$ref" in main|refs/heads/main|*:main|*:refs/heads/main) die "refusing to push main";; esac; done
  git -C "$MAIN_WT" push "${EXCELLENCE_REMOTE:-origin}" "$@" || echo "WARN: backup push failed (continuing; local state is authoritative)" >&2
}

flip_status() { # flip_status <step> <STATUS>
  python3 - "$INT_WT/$REL/INDEX.md" "$1" "$2" <<'PY'
import re, sys
path, step, status = sys.argv[1], sys.argv[2], sys.argv[3]
lines = open(path).read().split("\n")
for i, l in enumerate(lines):
    cells = l.split("|")
    if len(cells) > 5 and cells[1].strip() == step:
        gate = cells[4].strip().split(" ", 1)
        cells[4] = " " + status + (" " + gate[1] if len(gate) > 1 else "") + " "
        lines[i] = "|".join(cells)
open(path, "w").write("\n".join(lines))
PY
}

case "${1:-}" in
  init)
    [ -z "$(git -C "$MAIN_WT" status --porcelain)" ] || die "main checkout is dirty — commit first (the plan assumes everything is committed)"
    git -C "$MAIN_WT" rev-parse -q --verify refs/tags/excellence/base >/dev/null || git -C "$MAIN_WT" tag -a excellence/base -m "main before Excellence cascade"
    git -C "$MAIN_WT" rev-parse -q --verify "refs/heads/$INT_BRANCH" >/dev/null || git -C "$MAIN_WT" branch "$INT_BRANCH" excellence/base
    [ -d "$INT_WT" ] || git -C "$MAIN_WT" worktree add "$INT_WT" "$INT_BRANCH"
    backup_push "$INT_BRANCH" refs/tags/excellence/base
    echo "integration worktree: $INT_WT (branch $INT_BRANCH, base tag excellence/base)"
    ;;

  sync)
    [ -d "$INT_WT" ] || die "run init first"
    [ -z "$(g status --porcelain)" ] || die "integration worktree dirty"
    if g merge-base --is-ancestor main HEAD; then echo "sync: integration already contains main"; exit 0; fi
    PRE="$(g rev-parse HEAD)"
    if ! g merge --no-ff -m "Sync committed main into integration" main >/tmp/excellence-sync.log 2>&1; then
      g merge --abort 2>/dev/null || g reset --hard "$PRE"
      die "sync conflict between main and integration (stop rule; see /tmp/excellence-sync.log)"
    fi
    backup_push "$INT_BRANCH"
    echo "sync: merged main $(git -C "$MAIN_WT" rev-parse --short main) into integration"
    ;;

  start)
    [ -d "$INT_WT" ] || die "run init first"
    [ -z "$(g status --porcelain)" ] || die "integration worktree dirty"
    bash "$0" sync
    bash "$HARNESS" start "$INT_WT/$REL"
    ;;

  land)
    n="${2:?step number}"; PB="cascade/excellence-$n"; P="PHASE-EX$n"
    [ -z "$(g status --porcelain)" ] || die "integration worktree dirty"
    git -C "$MAIN_WT" rev-parse -q --verify "refs/heads/$PB" >/dev/null || die "no branch $PB"
    LOG="$(git -C "$MAIN_WT" show "$PB:$REL/$P-VERIFY-LOG.md" 2>/dev/null)" || die "$P-VERIFY-LOG.md not committed on $PB"
    echo "$LOG" | grep -q '^\*\*Exit code:\*\* 0$' || die "verify log does not show exit 0"
    VC="$(echo "$LOG" | sed -nE 's/^\*\*Commit:\*\* ([0-9a-f]{40}).*/\1/p')"
    [ -n "$VC" ] || die "verify log has no commit"
    git -C "$MAIN_WT" merge-base --is-ancestor "$VC" "$PB" || die "verified commit $VC is not on $PB"
    AFTER="$(git -C "$MAIN_WT" diff --name-only "$VC" "$PB" | grep -vE "^$REL/($P-(VERIFY-LOG|COLD-REVIEW|REPORT)\.md|DECISIONS-LOG\.md|FINAL-REVIEW\.md)$" || true)"
    [ -z "$AFTER" ] || die "files changed after verification (re-verify first): $AFTER"
    [ -z "$(git -C "$MAIN_WT" ls-tree --name-only "$PB" -- .cascade-lane)" ] || die ".cascade-lane is committed on $PB — remove it (it is per-worktree state)"
    REVIEW="$(git -C "$MAIN_WT" show "$PB:$REL/$P-COLD-REVIEW.md" 2>/dev/null)" || die "$P-COLD-REVIEW.md missing"
    echo "$REVIEW" | grep -qiE '\*\*verdict\*\* *\| *PASS' || die "cold review verdict is not PASS"
    PRE="$(g rev-parse HEAD)"
    g merge --no-ff -m "Land EX$n via $PB (gate + cold review PASS)" "$PB"
    echo "== regression: gates EX0..EX$n on integration"
    for i in $(seq 0 "$n"); do
      if ! (cd "$INT_WT" && bash "$REL/PHASE-EX$i.exit-gate.sh" > "/tmp/excellence-regress-$i.log" 2>&1); then
        g reset --hard "$PRE"
        die "regression: EX$i gate fails after landing EX$n (log /tmp/excellence-regress-$i.log); integration reset to $PRE"
      fi
      echo "  EX$i ok"
    done
    flip_status "$n" DONE
    [ "$n" -lt 11 ] && flip_status "$((n + 1))" READY
    g add "$REL/INDEX.md" && g commit -q -m "EX$n DONE; EX$((n + 1)) READY"
    g tag -a "excellence/ex$n" -m "EX$n landed" HEAD
    g worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r wt; do
      [ "$(cat "$wt/.cascade-lane" 2>/dev/null || true)" = excellence ] && [ "$(git -C "$wt" branch --show-current)" = "$PB" ] && git -C "$MAIN_WT" worktree remove --force "$wt"
    done
    backup_push "$INT_BRANCH" "$PB" "refs/tags/excellence/ex$n"
    echo "landed EX$n; tag excellence/ex$n"
    ;;

  rollback)
    n="${2:?step number}"
    TARGET="excellence/base"; [ "$n" -gt 0 ] && TARGET="excellence/ex$((n - 1))"
    git -C "$MAIN_WT" rev-parse -q --verify "refs/tags/$TARGET" >/dev/null || die "no tag $TARGET"
    [ -z "$(g status --porcelain)" ] || die "integration worktree dirty"
    RB_TAG="excellence/rollback-$(date -u +%Y%m%dT%H%M%SZ)"
    g tag -a "$RB_TAG" -m "integration before rollback of EX$n+" HEAD
    g reset --hard "$TARGET"
    if [ "${EXCELLENCE_PUSH:-0}" = 1 ]; then
      git -C "$MAIN_WT" push "${EXCELLENCE_REMOTE:-origin}" --force-with-lease "$INT_BRANCH" "refs/tags/$RB_TAG" || echo "WARN: rollback push failed" >&2
    fi
    echo "integration reset to $TARGET; phase branches and later tags kept for inspection"
    ;;

  status)
    git -C "$MAIN_WT" tag -l 'excellence/*' -n1
    git -C "$MAIN_WT" branch --list 'excellence/*' 'cascade/excellence-*' -v
    git -C "$MAIN_WT" worktree list
    ;;

  release-notes)
    cat <<EOF
Final review (professor):
  cd "$INT_WT" && bundle exec jekyll serve --source docs --config _config.yml --port 4013
  read $REL/FINAL-REVIEW.md
Release (one merge, on main):
  cd "$MAIN_WT" && git tag -a excellence/pre-release -m "main before Excellence release" main
  git merge --no-ff $INT_BRANCH -m "Release Excellence cascade" && git push origin main --follow-tags
Roll back after release (no force-push, students see the old site after the Pages build):
  git revert -m 1 <release-merge-sha> && git push origin main
Roll back one phase after release:
  git revert -m 1 <that phase's "Land EXn" merge sha> && git push origin main
EOF
    ;;

  *) die "usage: gitflow.sh {init|start|land <n>|rollback <n>|status|release-notes}" ;;
esac
