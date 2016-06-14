@echo off

:main
echo Simple control panel for running PhoneGap commands
echo.
echo Available commands:
echo - start: Fires up the local server for debugging purposes
echo - build: Creates an APK file in /platforms/android/build/outputs/apk/
echo - debug: Attempts to run the application the connected device
echo - update: Updates the PhoneGap installation
echo - exit: Closes down
echo.
set /p cmd=Enter command: 

IF %cmd%==start GOTO start
IF %cmd%==webserver GOTO start
IF %cmd%==build GOTO build
IF %cmd%==debug GOTO debug
IF %cmd%==update GOTO update
exit

:start
cls
phonegap serve
goto leave

:build
cls
phonegap build android --release
goto leave

:debug
cls
echo Make sure to have your Android device connected via the ADB before proceeding!
pause
phonegap run android --device
goto leave

:update
cls
echo Updating PhoneGap!
npm i -g phonegap
goto leave

:leave
pause
exit