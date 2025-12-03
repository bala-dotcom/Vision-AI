@echo off
echo ===============================================================
echo   Checking Hostinger Upload Status via SSH
echo ===============================================================
echo.

set SSH_KEY=%USERPROFILE%\.ssh\id_rsa_github_hostinger
set SERVER=u623025070@in-mum-web1990.main-hosting.eu
set REMOTE_PATH=/home/u623025070/domains/vision.innovfix.in/public_html

echo Checking files on server...
echo.

if exist "%SSH_KEY%" (
    echo Using SSH key: %SSH_KEY%
    echo.
    ssh -i "%SSH_KEY%" %SERVER% "cd %REMOTE_PATH% && echo === Files in public_html === && ls -la && echo. && echo === Assets folder === && ls -la assets/ 2>nul || echo assets/ not found && echo. && echo === Backend folder === && ls -la backend/ 2>nul || echo backend/ not found"
) else (
    echo SSH key not found. Using password authentication...
    echo.
    ssh %SERVER% "cd %REMOTE_PATH% && echo === Files in public_html === && ls -la && echo. && echo === Assets folder === && ls -la assets/ 2>nul || echo assets/ not found && echo. && echo === Backend folder === && ls -la backend/ 2>nul || echo backend/ not found"
)

echo.
echo ===============================================================
pause

