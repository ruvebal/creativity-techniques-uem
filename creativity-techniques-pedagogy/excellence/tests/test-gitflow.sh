#!/usr/bin/env bash
# Disposable end-to-end test of gitflow.sh + cascade-harness.sh.
# Clones the repo into a temp dir, stubs the EX0/EX1 gates, and checks:
#   1 land succeeds          4 cold review FAIL is refused
#   2 change-after-verify    5 regression failure resets integration
#     is refused             6 rollback restores the previous tag
#   3 committed .cascade-lane is refused
# Usage: bash creativity-techniques-pedagogy/excellence/tests/test-gitflow.sh
set -uo pipefail
SRC="$(git rev-parse --show-toplevel)"
E=creativity-techniques-pedagogy/excellence
H="${CASCADE_HARNESS:-$HOME/src/.cursor/skills/cascade-forge/scripts/cascade-harness.sh}"
T0="$(mktemp -d -t excellence-gitflow)" || exit 1
# Never let a failed mktemp turn the cleanup into "delete the current directory".
case "$T0" in */excellence-gitflow*) ;; *) echo "unsafe temp dir: $T0" >&2; exit 1 ;; esac
T="$(cd "$T0" && pwd -P)" || exit 1
case "$T" in */excellence-gitflow*) ;; *) echo "unsafe temp dir: $T" >&2; exit 1 ;; esac
trap 'rm -rf -- "$T"' EXIT
FAILS=0
export EXCELLENCE_PUSH=0   # never push to the real origin from this test
ok() { echo "PASS: $*"; }
ko() { echo "FAIL: $*"; FAILS=$((FAILS + 1)); }
expect_refused() { local label="$1"; shift; if out="$("$@" 2>&1)"; then ko "$label (was accepted)"; else echo "$out" | grep -q REFUSED && ok "$label" || ko "$label ($out)"; fi; }
stub() { printf '#!/usr/bin/env bash\necho stub; exit %s\n' "$2" > "$1"; chmod +x "$1"; }
commit() { git add -A && git -c user.name=t -c user.email=t@t commit -qm "$1"; }

git clone -q "$SRC" "$T/repo" && cd "$T/repo" && git checkout -q -B main
git for-each-ref --format="%(refname:short)" refs/heads | while read -r b; do [ "$b" = main ] || git branch -q -D "$b"; done
git tag -l "excellence/*" | while read -r tg; do git tag -d "$tg" >/dev/null; done
rm -rf "$E" && cp -R "$SRC/$E" "$E" && cp "$SRC/.gitignore" .gitignore
stub "$E/PHASE-EX0.exit-gate.sh" 0; stub "$E/PHASE-EX1.exit-gate.sh" 0
commit "pack under test"
git config user.name t; git config user.email t@t
bash "$E/gitflow.sh" init >/dev/null 2>&1 || ko init
I="$T/repo-integration"; cd "$I"; git config user.name t; git config user.email t@t

phase() { # phase <n> <verdict> [extra-file-after-verify]
  bash "$E/gitflow.sh" start >/dev/null 2>&1 || { ko "start $1"; return; }
  local P="$T/repo-integration-excellence-$1"
  (cd "$P" && echo "work $1" > "$E/work-$1.txt" && commit "work $1" \
    && bash "$H" verify "$I/$E" "PHASE-EX$1.md" "$P" >/dev/null 2>&1 \
    && printf '| **verdict** | %s |\n' "$2" > "$E/PHASE-EX$1-COLD-REVIEW.md" \
    && { [ -z "${3:-}" ] || echo x > "$3"; } && commit "evidence $1")
}

phase 0 PASS
git init -q --bare "$T/backup.git" && git -C "$T/repo" remote add backup "$T/backup.git"
EXCELLENCE_PUSH=1 EXCELLENCE_REMOTE=backup bash "$E/gitflow.sh" land 0 >/dev/null 2>&1 && git rev-parse -q --verify refs/tags/excellence/ex0 >/dev/null && ok "1 land EX0" || ko "1 land EX0"
git -C "$T/backup.git" rev-parse -q --verify refs/heads/excellence/integration >/dev/null && git -C "$T/backup.git" rev-parse -q --verify refs/tags/excellence/ex0 >/dev/null && ok "1b backup pushed integration + tag" || ko "1b backup push"
git -C "$T/backup.git" rev-parse -q --verify refs/heads/main >/dev/null && ko "1c main was pushed" || ok "1c main not pushed"

phase 1 PASS docs/sneaky.md
expect_refused "2 change after verification" bash "$E/gitflow.sh" land 1
P1="$T/repo-integration-excellence-1"
(cd "$P1" && git rm -q docs/sneaky.md && git add -f .cascade-lane && commit "lane file" && bash "$H" verify "$I/$E" PHASE-EX1.md "$P1" >/dev/null 2>&1 && commit log)
expect_refused "3 committed .cascade-lane" bash "$E/gitflow.sh" land 1
(cd "$P1" && git rm -q --cached .cascade-lane && commit "unlane" && bash "$H" verify "$I/$E" PHASE-EX1.md "$P1" >/dev/null 2>&1 \
  && printf '| **verdict** | FAIL |\n' > "$E/PHASE-EX1-COLD-REVIEW.md" && commit "review fail")
expect_refused "4 cold review FAIL" bash "$E/gitflow.sh" land 1
(cd "$P1" && stub "$E/PHASE-EX0.exit-gate.sh" 1 && commit "break EX0 gate" && bash "$H" verify "$I/$E" PHASE-EX1.md "$P1" >/dev/null 2>&1 \
  && printf '| **verdict** | PASS |\n' > "$E/PHASE-EX1-COLD-REVIEW.md" && commit "review pass")
PRE="$(git rev-parse HEAD)"
expect_refused "5 regression failure" bash "$E/gitflow.sh" land 1
[ "$(git rev-parse HEAD)" = "$PRE" ] && ok "5b integration reset after regression" || ko "5b integration not reset"
(cd "$P1" && stub "$E/PHASE-EX0.exit-gate.sh" 0 && commit "fix EX0 gate" && bash "$H" verify "$I/$E" PHASE-EX1.md "$P1" >/dev/null 2>&1 && commit log3)
bash "$E/gitflow.sh" land 1 >/dev/null 2>&1 && ok "6a land EX1" || ko "6a land EX1"
bash "$E/gitflow.sh" rollback 1 >/dev/null 2>&1
[ "$(git rev-parse HEAD)" = "$(git rev-parse excellence/ex0^{commit})" ] && ok "6b rollback to excellence/ex0" || ko "6b rollback"
git -C "$T/repo" rev-parse main | grep -q "$(git -C "$T/repo" rev-parse excellence/base^{commit})" && ok "main untouched" || ko "main moved"

# 7 sync: committed main changes flow into integration; a conflict is refused
(cd "$T/repo" && echo "teacher edit" > docs/teacher-note.md && commit "teacher edit on main")
bash "$E/gitflow.sh" sync >/dev/null 2>&1 && [ -f docs/teacher-note.md ] && ok "7a sync merges main" || ko "7a sync merges main"
(cd "$T/repo" && echo "conflicting" > "$E/work-0.txt" && commit "conflict on main")
PRE="$(git rev-parse HEAD)"
expect_refused "7b sync conflict refused" bash "$E/gitflow.sh" sync
[ "$(git rev-parse HEAD)" = "$PRE" ] && [ -z "$(git status --porcelain)" ] && ok "7c integration clean after refused sync" || ko "7c integration not clean"

echo "failures: $FAILS"; [ "$FAILS" -eq 0 ]
