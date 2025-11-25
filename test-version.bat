@echo off
REM Script de test rapide pour vérifier le Cache Buster
echo.
echo =========================================
echo   Test du Cache Buster
echo =========================================
echo.

echo Verification des fichiers...
echo.

if not exist cache-buster.js (
    echo [ERREUR] cache-buster.js introuvable
    goto :error
) else (
    echo [OK] cache-buster.js trouve
)

if not exist index.html (
    echo [ERREUR] index.html introuvable
    goto :error
) else (
    echo [OK] index.html trouve
)

if not exist dashboard.html (
    echo [ERREUR] dashboard.html introuvable
    goto :error
) else (
    echo [OK] dashboard.html trouve
)

echo.
echo Verification de l'integration du Cache Buster...
echo.

findstr /C:"CacheBuster.config.version" index.html >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Cache Buster integre dans index.html
) else (
    echo [ERREUR] Cache Buster NON integre dans index.html
)

findstr /C:"CacheBuster.config.version" dashboard.html >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Cache Buster integre dans dashboard.html
) else (
    echo [ERREUR] Cache Buster NON integre dans dashboard.html
)

findstr /C:"CacheBuster.config.version" login.html >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Cache Buster integre dans login.html
) else (
    echo [ERREUR] Cache Buster NON integre dans login.html
)

findstr /C:"CacheBuster.config.version" analytics.html >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Cache Buster integre dans analytics.html
) else (
    echo [ERREUR] Cache Buster NON integre dans analytics.html
)

echo.
echo Extraction des versions actuelles...
echo.

for %%f in (index.html dashboard.html login.html analytics.html) do (
    for /f "tokens=2 delims='" %%v in ('findstr /C:"CacheBuster.config.version" %%f 2^>nul') do (
        echo %%f : Version %%v
    )
)

echo.
echo =========================================
echo   Test termine
echo =========================================
echo.
echo Pour mettre a jour la version :
echo   update-version.bat 1.0.1
echo   update-version.bat timestamp
echo.
echo Pour tester dans le navigateur :
echo   Ouvrir test-cache-buster.html
echo.
goto :end

:error
echo.
echo [ERREUR] Un ou plusieurs fichiers sont manquants
echo.

:end
pause
