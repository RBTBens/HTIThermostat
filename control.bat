@echo off

:main
echo Simple control panel for running PhoneGap commands
echo.
echo Available commands:
echo - webserver: Fires up the local server for debugging purposes
echo - build: Creates an APK file in /platforms/android/build/outputs/apk/
echo - debug: Attempts to run the application on an emulated device
echo - exit: Closes down
echo.
set /p cmd=Enter command: 

IF %cmd%==webserver GOTO webserver
IF %cmd%==build GOTO build
IF %cmd%==debug GOTO debug
exit

:webserver
cls
phonegap serve
goto leave

:build
cls
phonegap build android --release
goto leave

:debug
cls
phonegap run android --device
goto leave

:leave
pause
exit