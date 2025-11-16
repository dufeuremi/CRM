@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 TEST DES CORRECTIONS CRM
echo ========================================
echo.
echo Ce script va:
echo   1. Vérifier que les fichiers sont modifiés
echo   2. Ouvrir la page de nettoyage du cache
echo   3. Ouvrir la page de test des fonctionnalités
echo.
pause

echo.
echo [1/3] Vérification des fichiers modifiés...
echo.

REM Vérifier que les modifications sont présentes
findstr /C:"Setup custom action button" "script.js" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ script.js - Bouton "Créer une action" OK
) else (
    echo ❌ script.js - Modifications manquantes!
    pause
    exit /b 1
)

findstr /C:"Charger également les emails programmés" "script.js" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ script.js - Chargement emails programmés OK
) else (
    echo ❌ script.js - Modifications manquantes!
    pause
    exit /b 1
)

findstr /C:"maxRotation: 45" "analytics.js" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ analytics.js - Configuration graphique OK
) else (
    echo ❌ analytics.js - Modifications manquantes!
    pause
    exit /b 1
)

echo.
echo [2/3] Ouverture de la page de nettoyage du cache...
timeout /t 2 /nobreak >nul
start http://localhost:8080/clear-cache.html

echo.
echo [3/3] Attendez la redirection automatique (2 secondes)...
timeout /t 3 /nobreak >nul

echo.
echo Voulez-vous ouvrir la page de test des fonctionnalités? (O/N)
set /p RESPONSE=
if /i "%RESPONSE%"=="O" (
    start http://localhost:8080/test-features.html
    echo.
    echo ✅ Page de test ouverte!
)

echo.
echo ========================================
echo   ✅ TERMINÉ
echo ========================================
echo.
echo Instructions:
echo   1. Le dashboard devrait être ouvert avec le cache vidé
echo   2. Appuyez sur F12 pour ouvrir la console
echo   3. Cherchez les messages de débogage
echo   4. Testez les 3 fonctionnalités:
echo      - Bouton "Créer une action"
echo      - Onglet Rappels (emails programmés)
echo      - Analytics (graphique de comparaison)
echo.
pause
