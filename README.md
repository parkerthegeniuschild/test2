# Truckup-Stack

## Getting Started

Some basic instructions on how to get this project set up. These instructions are a work in progress, please add additional tips in here if you find they are missing!

### AWS Configuration

NOTE: YOU MUST BE USING AWS CLI V2!! If you are still using CLI V1, use the [AWS Migration Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cliv2-migration-instructions.html) to get V2. If you are already on V2, you should [update to the latest version](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (or make sure you are >= v2.9)

If you already have your AWS CLI set up, then the easiest way to configure the new SSO auth is to manually edit your AWS configs.

1. Check `~/.aws/credentials`, and remove any old Truckup config from there. If it becomes empty, just delete the file.
2. Check `~/.aws/config`, remove any old Truckup config, and add the following sections:

```
[profile sandbox]
sso_session = truckup-sso
sso_account_id = 193886518961
sso_role_name = TruckupDeveloper
region = us-east-2

[sso-session truckup-sso]
sso_start_url = https://truckup.awsapps.com/start
sso_region = us-east-1
sso_registration_scopes = sso:account:access
```

If you are setting up the CLI from scratch, check the [AWS Documentation](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html) and set up using the wizard to match with above.

You can now authenticate your CLI by invoking `yarn sso`. This should automatically open your web browser to the Truckup AWS portal, which will attempt to log in via your Truckup email (gmail). Once successful, you can use the CLI and SST. If your session times out, you will get an auth error that suggests you re-authenticate. You can re-authenticate by running `yarn sso` again.

### Sending Emails with AWS SES

To test the invoice dispatch feature locally, you will need to have a verified identity in Amazon Simple Email Service (SES) before you can receive emails. You need to verify the email address(es) you want to use. This process ensures that you own them and helps to maintain email deliverability. The test emails will be dispatched from `billing@truckup.tech`.

### Steps

1. Sign in to the [AWS Management Console](https://us-east-2.console.aws.amazon.com/console/home?region=us-east-2).

2. Search for `SES` in the Services search bar and select `Amazon Simple Email Service`.

3. Access the `Verified identities` section, under `Configurations` in the left-hand navigation pane.

4. Click the `Create identity` button to initiate the verification process.

5. Choose `Email address` as the identity type.

6. In the Email address field, type the email address you want to verify.
   
7. Under `Tags`, click the `Add new tag` button. Enter `clickops` as key and `true` as value.
   
8.  Click the `Create identity` button to proceed.

9. Amazon SES will send a verification email to the address you specified. Open the email and click on the verification link to confirm your ownership of the address.

10. Once you've clicked the link, return to the SES console and check the `Verified identities` page. The status of your email address should now be `Verified`.

### Additional Notes

Sandbox mode: Accounts in sandbox mode have sending limits.
Troubleshooting: If you encounter issues, refer to the [AWS SES documentation](https://docs.aws.amazon.com/ses/).

### Set Node.js version using NVM

**To set your local Node.js version to the project's specified version, run `nvm use`. You will need to do this when you open a new terminal.**

If you do not have NVM installed, then you need to install it. Check out the [NVM readme](https://github.com/nvm-sh/nvm#installing-and-updating), or just run one of the following:

```console
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

or

```console
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Close and reopen your terminal, then you should be able to run `nvm use` inside the project.

You may need to install a specific version of Node.js onto your computer:

```console
$ nvm install [version]
```

After installing a new Node.js version, don't forget that you will need to install yarn again:

```console
$ npm install -g yarn
```

JV has a tip on setting up your `zsh` terminal to automatically switch node versions with nvm: [Slack Message](https://truckup.slack.com/archives/C06CQ0EAC/p1689097080480159?thread_ts=1689094716.569999&cid=C06CQ0EAC)


### Private Packages

This project uses a private package, `@gettruckup/bindings`, hosted on the Github Private Packages registry. [Click here](https://github.com/gettruckup/truckup-stack/pkgs/npm/bindings) for a detailed guide on installing and using this package.
