# Human-Technology Interaction: Thermostat
Thermostat built using PhoneGap

Installation prerequisites:
- Download Node.js from [here](https://nodejs.org/en/)
- Clone the Git repository
- Shift right click in the root of the git folder and click "Open command window here"
- Type `npm install -g phonegap@latest` to get the PhoneGap CLI

Compiling prerequisites (Android APK files only):
- Download the Android SDK, which comes bundled in Android Studio [here](https://developer.android.com/studio/index.html)
- Follow the basic instructions described [here](https://developer.android.com/studio/install.html)

How to use:
- Open the `control.bat` batch file
- Follow instructions on the terminal (use commands like `debug` and `build`)

To-Do List:
- [ ] Add an easy-to-use frontend structure for communicating with the thermostat
- [ ] Create skeleton system for loading different pages
- [ ] Test `cordova-plugin` versions like `file, dialogs, vibration, media, statusbar, device-motion` from [the apache repo](https://github.com/apache?utf8=%E2%9C%93&query=cordova-plugin) -> missing plugins can be obtained from [here](http://cordova.apache.org/plugins/)