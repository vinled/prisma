@echo off
setlocal
cd /d "%~dp0"
title PostNaMao - Servidor local
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js LTS e abra este arquivo novamente.
  echo Site: https://nodejs.org/
  pause
  exit /b 1
)
node "scripts\start-local.cjs"
if errorlevel 1 (
  echo.
  echo O servidor nao iniciou. Leia a mensagem acima.
  pause
)
endlocal
