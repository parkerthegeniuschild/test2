#!/bin/bash

# Define the order of AWS profile sources
# 1. Optional argument
# 2. AWS_PROFILE environment variable
# 3. Default profile 'sandbox'
if [ "$#" -eq 1 ]; then
  # If an argument is passed, use it as the profile
  AWS_PROFILE="$1"
elif [ -n "$AWS_PROFILE" ]; then
  # If AWS_PROFILE environment variable is set, use it
  AWS_PROFILE="$AWS_PROFILE"
else
  # Default to 'sandbox' if no argument or environment variable
  AWS_PROFILE="sandbox"
fi

# Run AWS SSO login with the specified AWS_PROFILE
AWS_PROFILE="$AWS_PROFILE" aws sso login

# Check if the AWS SSO login command was successful
if [ $? -eq 0 ]; then
  echo "AWS SSO login successful for profile: $AWS_PROFILE"
else
  echo "AWS SSO login failed for profile: $AWS_PROFILE"
  exit 1
fi
