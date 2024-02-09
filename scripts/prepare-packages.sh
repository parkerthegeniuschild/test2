#!/bin/bash

workspaces=$(yarn workspaces --silent info | grep "location" | awk '{print $2}' | tr -d '"' | tr -d ',')

for workspace in $workspaces
do
  if [ -f "$workspace/package.json" ] && grep -q '"prepare"' "$workspace/package.json"; then
    (cd "$workspace" && yarn prepare)
  else
    echo "Skipping $workspace: 'prepare' script not found"
  fi
done
