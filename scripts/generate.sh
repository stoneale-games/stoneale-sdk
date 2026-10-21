#!/usr/bin/env bash
# Regenerate the typed contract clients from the deployed testnet contracts.
# Requires the Stellar CLI: https://developers.stellar.org/docs/tools/cli
set -euo pipefail
cd "$(dirname "$0")/.."

REWARDS=CB5CGHND7BPEJZBUKN4AO3UHNHXGG2U2OJ6ASWERKMMW54KIUKXOC6QC
BADGES=CBXEHWTFJDNWZNZESWLE67EODOBKSJG333F6ECPARPBXAV476J26RCOZ

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

stellar contract bindings typescript --network testnet --contract-id "$REWARDS" --output-dir "$tmp/rewards" --overwrite
stellar contract bindings typescript --network testnet --contract-id "$BADGES" --output-dir "$tmp/badges" --overwrite

cp "$tmp/rewards/src/index.ts" src/generated/stone-rewards.ts
cp "$tmp/badges/src/index.ts" src/generated/wellness-badges.ts
echo "Regenerated src/generated/*. Run 'npm test' to verify."
