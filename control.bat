@echo off

:main
echo Simple control panel for running PhoneGap commands
echo.
echo Available commands:
echo - debug: Fires up the local server for debugging purposes
echo - build: CURRENTLY UNAVAILABLE!
echo - exit: Closes down
echo.
set /p cmd=Enter command: 

IF %cmd%==debug GOTO debug
IF %cmd%==build GOTO build
exit

:debug
cls
echo Press enter to launch the server!
pause
phonegap serve
goto leave

:build
cls
echo Hi2
goto leave

:leave
pause
exit