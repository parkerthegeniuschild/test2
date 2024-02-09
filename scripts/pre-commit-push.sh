#!/bin/sh -e

if [ $(git diff --cached --name-only --diff-filter=ACMRTUXB | grep -E 'packages/functions(.*)\.(ts)$' -c) -ne "0" ]
then
	echo "Running ESLint"
	yarn eslint packages/functions/vitest.config.ts $(git diff --name-only HEAD | grep -E 'packages/functions(.*)\.(ts)$' | xargs)
fi


if [ $(git diff --cached --name-only --diff-filter=ACMRTUXBD | grep -E '^(packages/functions)|(packages/lib)|(packages/utils)|(patches)|(sst.config.ts)|(stacks).*' -c) -ne "0" ]
then
	echo "BACKEND TESTS ARE DISABLED!!"
	# echo "Running Backend Tests"
	# yarn test:backend
fi

yarn generate-open-api 

echo "Checking for changes in open api specs..."

if [ $(git diff --name-only --cached -- packages/functions/src/openAPI/out/api-docs.yaml) ]
then
  yarn workspace @truckup/bindings run bump-version
  git add packages/bindings/package.json
fi

echo "Pre-commit checks passed"
