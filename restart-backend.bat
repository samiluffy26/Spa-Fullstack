@echo off
echo Reiniciando el servidor backend...
taskkill /F /IM node.exe
timeout /t 2
cd server
npm start
