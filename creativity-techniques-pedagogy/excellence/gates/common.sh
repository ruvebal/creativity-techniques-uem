# Shared helpers for PHASE-EXn.exit-gate.sh scripts. Source, do not execute.
# Each gate counts failures and exits non-zero if any check failed, so the
# verify log shows every failing check, not only the first one.
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT" || exit 2
CASCADE="creativity-techniques-pedagogy/excellence"
DECKS="docs/tracks/en/uem/2627-ct"
LESSONS="docs/lessons/en/creativity-techniques"
FAILS=0
# Amendment A1: the cascade owns U1–U3 + master lecture; U4–U6 are out of scope.
# Amendment A2/F6: scope by exclusion of u-[4-9]-*.
SCOPED_LESSONS=(); for d in "$LESSONS"/* docs/lessons/en/master-lectures; do case "$d" in */u-[4-9]-*) ;; *) [ -e "$d" ] && SCOPED_LESSONS+=("$d") ;; esac; done
SCOPED_DECKS=(); for d in "$DECKS"/*; do case "$d" in */u-[4-9]-*) ;; *) [ -d "$d" ] && SCOPED_DECKS+=("$d") ;; esac; done
# Built-site HTML files in scope (drops rendered U4–U6 lessons and decks).
scoped_site_html() { find _site -name '*.html' | grep -vE '/u-[4-9]-'; }

pass() { echo "PASS: $*"; }
fail() { echo "FAIL: $*"; FAILS=$((FAILS + 1)); }

# check "<label>" <command...>  — passes when the command exits 0
check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then pass "$label"; else fail "$label"; fi
}

# absent "<label>" <regex> <paths...> — passes when grep finds nothing
absent() {
  local label="$1" regex="$2"; shift 2
  local hits
  hits="$(grep -rniE -- "$regex" "$@" 2>/dev/null | head -5)"
  if [ -z "$hits" ]; then pass "$label"; else fail "$label"; echo "$hits"; fi
}

# present "<label>" <regex> <paths...>
present() {
  local label="$1" regex="$2"; shift 2
  if grep -rqiE -- "$regex" "$@" 2>/dev/null; then pass "$label"; else fail "$label"; fi
}

# Build without prebuild (no rehydration, no postcss): node_modules may be
# absent in a fresh worktree.
build_site() {
  rm -rf _site
  if bundle exec jekyll build --source docs --destination _site --config _config.yml >/tmp/excellence-build.log 2>&1; then
    pass "jekyll build"
  else
    fail "jekyll build (see /tmp/excellence-build.log)"; tail -20 /tmp/excellence-build.log
  fi
}

finish() {
  echo "----"
  echo "failures: $FAILS"
  [ "$FAILS" -eq 0 ]
}
