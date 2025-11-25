@echo off
REM Script batch pour mettre à jour la version du Cache Buster
REM Usage: update-version.bat 2.0.0
REM        update-version.bat timestamp

setlocal

if "%~1"=="" (
    echo Usage: update-version.bat [version] ou update-version.bat timestamp
    echo.
    echo Exemples:
    echo   update-version.bat 1.0.0
    echo   update-version.bat 2.1.5
    echo   update-version.bat timestamp
    exit /b 1
)

echo.
echo ========================================
echo   Cache Buster - Mise a jour version
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Node.js depuis https://nodejs.org/
    exit /b 1
)

REM Exécuter le script de mise à jour
node update-version.js %1

echo.
pause
