@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo =======================================================
echo    HSK CURRICULUM STUDIO - TOOL SOAN GIAO TRINH NGOAI
echo =======================================================
echo Dang tim Python tren may tinh...

set PYTHON_EXE=

:: 1. Kiem tra python trong PATH
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PYTHON_EXE=python
    goto :FOUND
)

:: 2. Kiem tra cac duong dan pho bien tren may
if exist "D:\miniconda\python.exe" (
    set PYTHON_EXE="D:\miniconda\python.exe"
    goto :FOUND
)

if exist "C:\ProgramData\miniconda3\python.exe" (
    set PYTHON_EXE="C:\ProgramData\miniconda3\python.exe"
    goto :FOUND
)

if exist "%USERPROFILE%\miniconda3\python.exe" (
    set PYTHON_EXE="%USERPROFILE%\miniconda3\python.exe"
    goto :FOUND
)

if exist "%USERPROFILE%\anaconda3\python.exe" (
    set PYTHON_EXE="%USERPROFILE%\anaconda3\python.exe"
    goto :FOUND
)

if exist "C:\Python312\python.exe" (
    set PYTHON_EXE="C:\Python312\python.exe"
    goto :FOUND
)

if exist "C:\Python311\python.exe" (
    set PYTHON_EXE="C:\Python311\python.exe"
    goto :FOUND
)

if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
    set PYTHON_EXE="%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    goto :FOUND
)

if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set PYTHON_EXE="%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    goto :FOUND
)

echo [LOI] Khong tim thay Python tren may tinh cua ban!
echo Vui long kiem tra lai duong dan Python hoac them Python vao bien moi truong PATH.
pause
exit /b 1

:FOUND
echo Da tim thay Python: %PYTHON_EXE%
echo Dang khoi dong tool soan giao trinh doc lap...
%PYTHON_EXE% "%~dp0tools\curriculum_editor.py"

if %errorlevel% neq 0 (
    echo.
    echo Tool da dong voi ma loi: %errorlevel%
    pause
)
