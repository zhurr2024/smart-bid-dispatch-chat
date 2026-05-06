' start-dev.vbs
' 双击此文件即可启动开发服务器（在新的 CMD 窗口中运行）
' 或在 CMD 中执行: cscript //NoLogo start-dev.vbs

Dim shell
Set shell = CreateObject("WScript.Shell")

' 在新的可见 CMD 窗口中运行 start-dev.bat（不等待，让服务器保持运行）
shell.Run "cmd /c ""D:\Program Files\FDE\Smart Bid Dispatch Chat\start-dev.bat""", 1, False

WScript.Echo "开发服务器已在新窗口中启动，请访问 http://localhost:5173"
