# Lyf Mobile App

> React Native Mobile Client for Lyf

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

## Installation

To run the app locally, first you need to install Expo Go from the App Store (or Android Store).
Then git clone, and run

```
yarn && npx expo start
```

Then scan the QR code provided and it will build the app on your device.

**Note**: You will need the `lyf-api` service running for the local version to work properly! That can be [installed here](https://github.com/Lyf-Planner/lyf-api)

## Contributions

Tasks to contribute to Lyf Mobile are defined in the [Lyf Mobile Jira](https://lyf-planner.atlassian.net/jira/software/projects/LM/boards/8/backlog?versions=visible). If you wish to make a contribution, you can

- Select a task from the version closest to the current one (found in `package.json`)
- Set yourself as the Assignee
- Checkout a branch from main, whose name should be that of the ticket (e.g. LM-13)
- Consult @ethanhusband about the changes to be made / you intend to make
- When the changes are complete and tested, make a PR and await review
