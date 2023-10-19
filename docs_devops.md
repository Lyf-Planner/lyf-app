

## Environment Configuration

Env variables should be updated + considered in the following locations before creating any build
  - A local .env file which is gitignored
  - app.config.ts - this injects the contents of .env to the app
  - eas.json

## Development

#### Prereqs

- Ensure you have Node.js installed
- Ensure you have eas cli installed (check with ```eas --version```) and you are logged in to the cli (check with ```eas account:view```)
  - If you are not logged in, create an account on the eas website *which is linked to the project* and run ```eas login```

#### Running the App

- Open a simulator
- Run ```npm run <build-android/build-ios>```
  - This will take a while
  - Needs to be redone whenever we change assets or env vars
- Run ```npm run use-build``` and select the latest build
  - This should install the build onto the simulator and open an expo interface
- Then finally do ```npm run start```
- When that opens press {i/a}, and then the development build should be running on the simulator

#### Common Issues

- In iOS simulator, sometimes ```npm run use-build``` doesn't install properly. You want to run ```xcrun simctl shutdown all && xcrun simctl erase all``` to reset all your simulators - sometimes your computer has multiple.
- Ensure you have run  ```npm install``` in all packages and have all the necessary packages running
- Permissions issues are common on mac. If you encounter "Insufficient permissions to save", navigate to the root folder and run ```sudo chown -R <myuser> .```