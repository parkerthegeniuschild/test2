#!/bin/sh -e

echo "Generating and staging open-api specs..."
yarn workspace @truckup-stack/functions run open-api:generate
