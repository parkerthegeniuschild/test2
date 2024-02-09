# Private Github Package Usage Guide

This guide will walk you through the steps to create a GitHub Classic Token with the `read:packages` scope. A classic token is a personal access token that can be used to authenticate to GitHub when using the GitHub API or accessing repositories through the command line. A classic token is required for installing the `@gettruckup/bindings` package from the GitHub Package Registry.

## Create a GitHub Classic Token

1. **Log in to GitHub:**
   Open your web browser and navigate to [GitHub](https://github.com/). Log in to your GitHub account if you haven't already.

2. **Access Personal Access Tokens Settings:**
   - Click on your profile picture in the top-right corner of the GitHub interface.
   - Select `Settings` from the dropdown menu.
   - In the left sidebar, click on `Developer settings.`

3. **Create a New Token:**
   - In the Developer settings menu, click on `Personal access tokens` and then click on `Tokens (classic)` in the dropdown that appears. 
   - Click the `Generate new token` button and then click on `Generate new token (classic)` with the label `For general use.`

4. **Configure Token Settings:**
   - Enter a name for your token in the `Note` field. Choose a name that helps you identify the purpose of the token.
   - Under `Expiration`, it is recommended to choose `No expiration.`
   - Under `Select scopes,` find and select only the `read:packages` scope.

5. **Generate Token:**
   - Scroll down and review the selected settings.
   - Click the `Generate token` button at the bottom of the page.

6. **Copy and Save Token:**
   - After the token is generated, GitHub will display the token on the screen.
   - Make sure to copy the token as you won’t be able to see it again! This token is sensitive information and should be treated like a password.

## Using the Classic Token

You can use the generated token as an authentication mechanism when interacting with GitHub Packages API or accessing repositories with the `packages:read` scope.

1. **Create a `.npmrc` File:**
   - Create this file in the root of the project and paste the contents of `.npmrc.example` into it. Replace `YOUR_TOKEN` with the newly generated token.

```console
@gettruckup:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

1. **Install the Package:** 
   - At this point, the package can be installed via yarn, npm or pnpm. For example:

```console
$ yarn add @gettruckup/bindings
```
