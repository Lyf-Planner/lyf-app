# Lyf Mobile App

> React Native Mobile Client for Lyf

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

## Installation

**Note**: You will need the `lyf-api` service to connect to for the local app to work properly! 
> You can clone the [ API here](https://github.com/Lyf-Planner/lyf-api) and set it up on your local machine or point to CI at https://lyf-api-ci.up.railway.app

#### Expo Go

Make sure you're on Node 18+

You can run the app very easily by installing **Expo Go** from the *App Store* or *Play Store*. Then following these steps:
- Run `yarn`
- Setup your `.env` file in accordance with `src/envManager.ts`
- Run `npx expo start`
- Scan the QR code provided and it will build the app on your Expo Go app.

#### Native App

If the app uses native modules, which would not be supported by Expo Go, then the alternative build process is to install an Expo dev build of the app like so:

- Run `eas login`. This will prompt you to login to Expo Application Services, which you will need an attached account for.
- Open an Android or iOS simulator
- Run ```npm run < build:android-sim / build:ios-sim >```
  - This will take a while
  - Needs to be redone whenever we change assets or env vars
- Run ```npm run use-build``` and select the latest build
  - This should install the build onto the simulator and open an expo interface
- Then finally do ```npm run start```
- When that opens press i for iOS, a for Android, and then the development build should be running on the simulator.

## Contributions

Tasks to contribute to Lyf App are defined in the [Lyf App Jira](https://lyf-planner.atlassian.net/jira/software/projects/LM/boards/8/backlog?versions=visible) that anyone can request access to.
Once granted access, if you wish to make a contribution:

- Select a task from the Kanban board
- Set yourself as the Assignee
- Checkout a branch from main, whose name should be that of the ticket with a description of the change (e.g. `git checkout -b lyf-13-implement-password-resets`)
- When the changes are complete and tested, make a PR to `main` branch and await review

#### Common Errors

- `non-std c++ expression`
  - Happens when the Expo cache has a state error. Not caused by anything we do, just run `npx expo start -c` to restart and clear the cache

## Deployments

Deployments are handled via Expo Application Services, and can all be delegated to @ethanhusband.

The live version of the app can be seen on the App Store [here](https://apps.apple.com/au/app/lyf/id6470702288). Currently the app is not available on Google Play store (though it probably could be).

## Project Structure

- `assets`
  - images
  - icons
  - fonts
- `components`
  - simple building blocks of the UI
  - stateless and controlled by props
  - can be composed of smaller components, as long as it is still stateless
- `containers`
  - stateful compositions of components or other containers (or component wrappers)
  - any component that wraps a container, is itself a container
- `pages`
  - key app routes
  - composed of containers and components
- `rest`
  - defines async functions that make calls to our REST API
- `schema`
  - common types used throughout the whole software including in the app and API
- `shell` 
  - services that wrap the entire application and are globally accessible
  - includes things like hook providers, authorisation logic, native interfaces
- `store`
  - contains globally accessible data stores for all API data
- `utils`
  - helper functions, constants and types used by containers or components throughout the app
- `App.tsx`
  - application entrypoint
  - wraps app with all providers with the Shell component
  - if unauthorised, auth gateway in the Shell will redirect to login 
  - if authorised, renders Routes
- `envManager.ts`
  - global interface for environment variables
- `Routes.tsx`
  - defines the apps key routes accessed via the TabNavigator
- `Shell.tsx`
  - composes all providers in the shell directory to wrap the entire app with

