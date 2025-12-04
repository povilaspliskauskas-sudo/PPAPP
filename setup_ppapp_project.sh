#!/usr/bin/env bash
set -euo pipefail

OWNER="povilaspliskauskas-sudo"      # GitHub username (or org)
REPO="PPAPP"                          # Repo name
PROJECT_TITLE="PPAPP – MVP Board"     # Project (v2) title

echo "==> Ensure project exists (or create it)"
PROJECT_NUMBER=$(gh project view "$PROJECT_TITLE" --owner "$OWNER" --format json --jq '.number' 2>/dev/null || true)
if [[ -z "${PROJECT_NUMBER:-}" ]]; then
  PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json --jq '.number')
  echo "Created project #$PROJECT_NUMBER"
else
  echo "Using existing project #$PROJECT_NUMBER"
fi

echo "==> Ensure labels (idempotent)"
ensure_label () { gh label create "$1" --repo "$OWNER/$REPO" --color "$2" --description "$3" --force >/dev/null || true; }
ensure_label "feature" "0E8A16" "new feature"
ensure_label "bug"     "D73A4A" "bug fix"
ensure_label "infra"   "5319E7" "infrastructure / devops"
ensure_label "docs"    "0C7D9D" "documentation"
ensure_label "ui/ux"   "1D76DB" "interface & experience"
ensure_label "db"      "FBCA04" "database & schema"
ensure_label "api"     "BFD4F2" "backend API"

add_issue () {
  local title="$1"
  local body="$2"
  local labels="$3"     # comma-separated
  local status="$4"     # "To do" | "In progress" | "Done"

  echo " -> Creating issue: $title"
  local ISSUE_URL
  ISSUE_URL=$(gh issue create \
    --repo "$OWNER/$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --format json --jq '.url')

  echo "    Adding to project #$PROJECT_NUMBER"
  local ITEM_ID
  ITEM_ID=$(gh project item-add \
    --owner "$OWNER" \
    --number "$PROJECT_NUMBER" \
    --url "$ISSUE_URL" \
    --format json --jq '.id')

  echo "    Setting Status = $status"
  gh project item-edit \
    --owner "$OWNER" \
    --number "$PROJECT_NUMBER" \
    --id "$ITEM_ID" \
    --field "Status" \
    --value "$status" >/dev/null

  echo "    Done: $ISSUE_URL"
}

echo "==> Create issues and place them in To do / In progress / Done"

# --- DONE (work we completed) ---
add_issue "Prisma schema aligned with Neon SQL (serial ids + maps)" \
"* Map Prisma models to Postgres quoted tables/columns
* Fix client build errors (childId vs childid)
* Regenerate client and verify Next.js build
* Document mapping in schema" \
"db,api" "Done"

add_issue "Agenda API route returns events filtered by child & date" \
"* Implement /api/agenda GET
* Filter by child + date
* Return {id,title,icon}" \
"api" "Done"

add_issue "Emotion API route (GET/POST) and unique-per-day constraint" \
"* Implement /api/emotions GET/POST
* Enforce (childId,date) unique
* Return last emotion + note" \
"api" "Done"

add_issue "Child switcher + Back to Home button" \
"* Fetch children
* Click to switch active child
* Reusable BackHome component" \
"feature,ui/ux" "Done"

add_issue "Age-based visual agenda presets (6 / 3 / 1 years)" \
"* Morning / Afternoon / Evening slots
* Emoji-first tasks
* Tapping toggles done state" \
"feature,ui/ux" "Done"

add_issue "Vercel deployment builds cleanly" \
"* Fix Prisma validation on Vercel
* Confirm functional URLs (/ /agenda /emotions)" \
"infra" "Done"

# --- IN PROGRESS (what we’re touching now / partial) ---
add_issue "GitHub Project board automation with gh" \
"* Install & auth gh in Codespaces
* Script to create project, labels, and issues
* Map statuses to To do / In progress / Done" \
"infra,docs" "In progress"

add_issue "Replace hard-coded tasks with DB-backed agenda entries" \
"* Persist toggles per child/date
* Keep presets as suggestions
* Add upsert in /api/agenda" \
"feature,api,db" "In progress"

# --- TO DO (next steps / stretch) ---
add_issue "Continuous Deployment polish: preview deployments per PR" \
"* Vercel Git integration checks
* Required status checks" \
"infra" "To do"

add_issue "UX pass for large tap targets & color contrast" \
"* 44px min target size
* High-contrast icons/text
* Keyboard focus styles" \
"ui/ux" "To do"

add_issue "Basic analytics/diag endpoint & log masking" \
"* /api/diag with build/meta
* Redact env secrets in logs" \
"infra,docs" "To do"

add_issue "README quickstart & architecture diagram" \
"* Local dev steps
* DB schema & routes
* Screenshots/GIFs" \
"docs" "To do"

echo "==> All set."
echo "Open the board in your browser:"
gh project view "$PROJECT_TITLE" --owner "$OWNER" --web
