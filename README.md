# Github Pages Template
A template to copy to make a react typescript project for github pages. This tool uses 
[bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/) for styling.

## Web Quick Start

Visit the [web page located on github pages](https://keeganw.github.io/templates/github-pages). This is running from 
the `gh-pages` branch, after running a `npm run deploy` command from the master branch.

## Local Development Setup

1. Install Node and NPM for your OS using [their website](https://nodejs.org/en/) or brew on Mac (`brew install node`)
2. In the root directory of the cloned project, run `npm i`. This will install all the necessary packages for you to 
   run this on your local machine.
3. Run `source .env` to add any required environment variables to your local path.
4. Once that is done, you can start the development server with `npm start`. If a web page is not automatically 
   opened...
   1. Go to [localhost:3000/templates/react-typescript](http://localhost:3000/templates/github-pages)

## Using the Tool

Copy this code (without the `node_modules`) to a new directory, and get started writing your own application!

## Pushing Changes to Github Pages

Using react's `gh-pages` you can simply run the below command to deploy to your github page.
```bash
npm run deploy
```
On the repository settings for your application (in this case, 
[https://github.com/KeeganW/templates/settings/pages](https://github.com/KeeganW/templates/settings/pages), go to the 
pages menu and set the branch to `gh-pages`. Your site will be published shortly!

## Linting

If you are using typescript or javascript, it is recommended you use a linter to format your code in a common 
pattern which is used for all developers. This project is pre-loaded with some sample configurations which can be a 
jumping off point for you. To format your code before you commit, run the following:
```bash
npx eslint src/**/*.tsx --fix
```
