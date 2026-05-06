@echo off
title Smart Bid Dispatch Chat - Dev Server
echo.
echo  ==================================================
echo   Smart Bid Dispatch Chat - 启动开发服务器
echo  ==================================================
echo.

cd /d "D:\Program Files\FDE\Smart Bid Dispatch Chat\frontend"

echo [1/2] 检查并安装依赖...
if not exist "node_modules\vite" (
    echo      正在运行 npm install，请稍候...
    call npm install
    if errorlevel 1 (
        echo 错误：npm install 失败，请检查 Node.js 是否已安装。
        pause
        exit /b 1
    )
) else (
    echo      依赖已存在，跳过安装。
)

echo.
echo [2/2] 启动 Vite 开发服务器...
echo      访问地址: http://localhost:5173
echo.
npm run dev
pause
