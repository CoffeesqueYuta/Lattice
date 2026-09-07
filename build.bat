@echo off
setlocal

rem === Prefer .NET Framework v4.0.30319 ===
set "CSC64=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
set "CSC32=C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"

if exist "%CSC64%" (
  set "CSC=%CSC64%"
) else if exist "%CSC32%" (
  set "CSC=%CSC32%"
) else (
  echo [ERROR] csc.exe not found in default .NET Framework locations.
  echo Checked:
  echo   %CSC64%
  echo   %CSC32%
  exit /b 1
)

echo Using compiler: %CSC%

rem === Resolve current user directory ===
set "USERDIR=%USERPROFILE%"

rem === Ensure Projects folder exists ===
if not exist "%USERDIR%\projects" (
  echo Creating Projects folder...
  mkdir "%USERDIR%\projects"
)

rem === Ensure project folder exists ===
if not exist "%USERDIR%\projects\Lattice" (
  echo Creating Lattice folder...
  mkdir "%USERDIR%\projects\Lattice"
)
set "PROJECTDIR=%USERDIR%\projects\Lattice"

rem === WebView2 DLL source directory ===
set "WEBVIEW2SRC=C:\Program Files\Microsoft Office\root\Office16\ADDINS\Microsoft Power Query for Excel Integrated\bin"

rem === Copy WebView2 runtime DLLs ===
echo Copying WebView2 DLLs...
if not exist "%WEBVIEW2SRC%\Microsoft.Web.WebView2.Core.dll" (
  echo [ERROR] Microsoft.Web.WebView2.Core.dll not found.
  echo %WEBVIEW2SRC%
  exit /b 1
)

if not exist "%WEBVIEW2SRC%\Microsoft.Web.WebView2.WinForms.dll" (
  echo [ERROR] Microsoft.Web.WebView2.WinForms.dll not found.
  echo %WEBVIEW2SRC%
  exit /b 1
)

if not exist "%WEBVIEW2SRC%\WebView2Loader.dll" (
  echo [ERROR] WebView2Loader.dll not found.
  echo %WEBVIEW2SRC%
  exit /b 1
)

copy /Y "%WEBVIEW2SRC%\Microsoft.Web.WebView2.Core.dll" "%PROJECTDIR%\" > nul
if errorlevel 1 (
  echo [Error] Failed to copy Microsoft.Web.WebView2.Core.dll.
  exit /b 1
)

copy /Y "%WEBVIEW2SRC%\Microsoft.Web.WebView2.WinForms.dll" "%PROJECTDIR%\" > nul
if errorlevel 1 (
  echo [Error] Failed to copy Microsoft.Web.WebView2.WinForms.dll.
  exit /b 1
)

copy /Y "%WEBVIEW2SRC%\WebView2Loader.dll" "%PROJECTDIR%\" > nul
if errorlevel 1 (
  echo [Error] Failed to copy WebView2Loader.dll.
  exit /b 1
)

echo [OK] WebView2 DLLs copied.

rem === Build ===
echo Building Lattice.exe ...

"%CSC%" /nologo ^
  /target:winexe ^
  /out:%PROJECTDIR%\Lattice.exe ^
  /reference:System.dll ^
  /reference:System.Windows.Forms.dll ^
  /reference:Microsoft.Web.WebView2.Core.dll ^
  /reference:Microsoft.Web.WebView2.WinForms.dll ^
  %PROJECTDIR%\*.cs

if errorlevel 1 (
  echo [ERROR] Build failed.
  exit /b 1
)

echo [OK] Build succeeded: %PROJECTDIR%\Lattice.exe
exit /b 0
