#!/usr/bin/env bash
# ScamCheck - https://github.com/matteobaccan/ScamCheck
# Author: Matteo Baccan - MIT License
#
# ScamCheck helper (optional): screenshot + HTML report + PDF in one go.
#
# Usage: bash make-pdf.sh <url> <data.json> <report_dir> [work_dir] [log_file]
#   <url>        page to screenshot (e.g. https://www.example.com/)
#   <data.json>  analysis data for gen-report.js (lang and domain are read from it)
#   <report_dir> where the PDF goes (e.g. report); existing files are never overwritten
#   [work_dir]   scratch folder (default: ./scamcheck-work)
#   [log_file]   raw output of collect.sh: added as an appendix to the PDF and saved next to it as .log.txt
#
# Requires: bash, node, Chrome/Chromium/Edge. Optional: pdftotext, pdftoppm (final check).
# Exit codes: 2 = no browser found, 3 = HTML generation failed, 4 = PDF not produced.
# On failure follow the manual steps in SKILL.md ("PDF report").

URL="${1:?usage: make-pdf.sh <url> <data.json> <report_dir> [work_dir] [log_file]}"; DATA="${2:?}"; RDIR="${3:?}"
W="${4:-./scamcheck-work}"; LOG="${5:-}"; HERE="$(cd "$(dirname "$0")" && pwd)"
DOMAIN=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).domain)' "$DATA") || exit 3
LANG_CODE=$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).lang||"en")' "$DATA")
OUTD="$W/report-$DOMAIN"; mkdir -p "$OUTD" "$RDIR"
# The browser needs absolute paths (on Windows also C:/ style)
RDIR="$(cd "$RDIR" && pwd)"; command -v cygpath >/dev/null 2>&1 && RDIR="$(cygpath -m "$RDIR")"

# Find a Chromium-based browser. Never call it without --headless (on Windows it would open a window).
BROWSER=""
for c in "$CHROME" \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" "/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "$(command -v google-chrome 2>/dev/null)" "$(command -v chromium 2>/dev/null)" "$(command -v chromium-browser 2>/dev/null)" "$(command -v microsoft-edge 2>/dev/null)"; do
  [ -n "$c" ] && [ -x "$c" ] && { BROWSER="$c"; break; }
done
[ -n "$BROWSER" ] || { echo "No Chrome/Chromium/Edge found (set CHROME=<path>)."; exit 2; }
PROFILE="$W/chrome-profile"
run(){ "$BROWSER" --headless=new --disable-gpu --user-data-dir="$PROFILE" "$@" >/dev/null 2>&1; }

# 1. Screenshot (isolated profile). A missing screenshot does not stop the report.
run --hide-scrollbars --window-size=1280,900 --virtual-time-budget=8000 --screenshot="$OUTD/home.png" "$URL"
[ -s "$OUTD/home.png" ] && echo "screenshot: $OUTD/home.png (look at it before delivering)" || echo "screenshot FAILED: the report will show an empty thumbnail; say so in the caption"

# 2. HTML
STAMP=$(date +%Y-%m-%d_%H%M); GEN=$(date "+%Y-%m-%d %H:%M")
LOGOPT=(); [ -n "$LOG" ] && { [ -s "$LOG" ] && LOGOPT=("--log=$LOG") || echo "log file missing or empty: PDF without appendix"; }
node "$HERE/gen-report.js" "$DATA" "$OUTD/report.html" "$GEN" "${LOGOPT[@]}" || exit 3

# 3. PDF with a unique name (history: never overwrite)
OUT="$RDIR/$DOMAIN-$STAMP-$LANG_CODE.pdf"; n=2
while [ -e "$OUT" ]; do OUT="$RDIR/$DOMAIN-$STAMP-$LANG_CODE-$n.pdf"; n=$((n+1)); done
ABS_HTML="$(cd "$OUTD" && pwd)/report.html"
# Windows (Git Bash/MSYS): convert /c/... or /tmp/... to C:/... for the browser
command -v cygpath >/dev/null 2>&1 && ABS_HTML="$(cygpath -m "$ABS_HTML")"
run --no-pdf-header-footer --print-to-pdf="$OUT" "file:///${ABS_HTML#/}"
[ -s "$OUT" ] || { echo "PDF not produced"; exit 4; }
echo "pdf: $OUT"

# Full log next to the PDF (same name, .log.txt), with a short header
if [ ${#LOGOPT[@]} -gt 0 ]; then
  LOGOUT="${OUT%.pdf}.log.txt"
  { echo "ScamCheck by Matteo Baccan - https://github.com/matteobaccan/ScamCheck"; echo "Domain: $DOMAIN | URL: $URL | Generated: $GEN"; echo "Raw output of the automated checks (untrusted third-party data)."; echo "------------------------------------------------------------------"; cat "$LOG"; } > "$LOGOUT"
  echo "log: $LOGOUT"
fi

# 4. Check
if command -v pdftotext >/dev/null 2>&1; then
  pages=$(pdftotext -layout "$OUT" - | grep -c "github.com/matteobaccan/ScamCheck" || true)
  echo "pages with footer: $pages (should equal the page count)"
  for p in 1 2 3 4; do h=$(pdftotext -f $p -l $p -layout "$OUT" - 2>/dev/null | grep -v '^\s*$' | head -1); [ -n "$h" ] && echo "page $p starts with: $h"; done
fi
command -v pdftoppm >/dev/null 2>&1 && pdftoppm -f 1 -l 1 -r 60 -png "$OUT" "$OUTD/page" && echo "preview: $OUTD/page-1.png"
