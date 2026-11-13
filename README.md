# M3U8-Downloader

基于 Electron 的 HLS（`.m3u8`）视频流下载、合并与播放工具。2.4.0 版本重做了桌面端界面，支持深色 / 浅色 / 跟随系统主题、分片级下载矩阵，以及可自定义的 ffmpeg 路径。

## 功能

<table>
<tr>
<td>模块</td>
<td>功能</td>
</tr>
<tr>
<td>下载器</td>
<td>
<ol>
<li>下载 `m3u8` 播放列表及普通视频直链（mp4 / flv / mp3 / wav）</li>
<li>录制 HLS 直播流</li>
<li>新建任务时自动读取剪切板</li>
<li>批量下载，一行一个视频源</li>
<li>视频分类，每个分类可单独设置存储目录</li>
<li>任务详情页提供分片下载矩阵（等待 / 下载中 / 成功 / 失败）</li>
<li>支持自定义 HTTP 请求头、私有 AES KEY/IV、URL 前缀</li>
<li>可调整同时下载数量、单文件重试次数和 HTTP 代理</li>
<li>下载完成后自动合并 TS 片段，可选择合并后删除片段</li>
<li>手动合并页：快速合并，或使用修复合并（转码，较慢）处理异常片段</li>
<li>ffmpeg 路径可配置，未配置时使用内置的 `ffmpeg-static`</li>
<li>中英文界面，深色 / 浅色 / 跟随系统主题</li>
<li>免费开源，无广告、无追踪</li>
<li>多平台支持：Windows 10+、macOS、Linux</li>
</ol>
</td>
</tr>
<tr>
<td>播放器</td>
<td>
<ol>
<li>旋转视频画面</li>
<li>播放其他本地媒体文件</li>
<li>窗口置顶</li>
</ol>
</td>
</tr>
</table>

<br/>

---

<br/>

## 如何获取 `.m3u8` 地址

在 Chrome 浏览器中按 F12 打开开发者工具，切换到 `Network`（网络）面板，在过滤框中输入 "m3u8"，然后按 F5 刷新页面。如果网页中的视频使用 HLS 源，就能在这里抓到视频流地址，右键选择「Copy → Copy link address」复制即可。将地址粘贴到本软件中，下载的分片会被无损合并为 MP4 文件。

## 下载

[Releases](https://github.com/xiejx/M3U8-Downloader/releases)

## 开发环境

```
- node -v   v20.4.0（Node 24 也已验证通过）
- yarn -v   v3.5.1
```

```
"dependencies": {
    "aria2": "^4.1.2",
    "async": "^3.2.4",
    "crypto-js": "^4.1.1",
    "dateformat": "^5.0.3",
    "download": "^8.0.0",
    "electron-context-menu": "^3.6.1",
    "electron-is-dev": "^2.0.0",
    "ffmpeg-static": "5.1.0",
    "filenamify": "4.3.0",
    "fluent-ffmpeg": "^2.1.2",
    "forever-monitor": "^3.0.3",
    "got": "11.8.3",
    "hpagent": "^1.2.0",
    "http": "0.0.0",
    "https": "^1.0.0",
    "m3u8-parser": "^6.1.0",
    "nconf": "^0.12.0",
    "queue": "^7.0.0",
    "url": "^0.11.0",
    "winston": "^3.8.2"
  },
  "devDependencies": {
    "electron": "^24.6.2",
    "electron-builder": "^24.4.0"
  },
```

### 项目结构

```
main.js                 Electron 主进程：窗口、IPC、下载/合并任务
src/main/               下载相关工具（重试逻辑、URL 解析、任务运行时/状态）
static/mainFrm.html     主窗口模板（下载 / 合并 / 设置三个页面）
static/scripts/         渲染进程逻辑与共享全局变量
static/css/             界面样式（instrument.css 为当前设计系统）
static/lang/            渲染进程多语言文案（en、zh-CN）
locales/                主进程多语言文案
test/smoke.js           下载工具链的冒烟测试
```

### 克隆代码

```
git clone https://github.com/xiejx/M3U8-Downloader.git
```

### 安装 Yarn

```
npm install yarn -g
```

### 升级到 yarn 3.5.1

```
yarn set version stable
```

### 安装依赖

```
yarn
```

### 运行

```
yarn start
```

### 冒烟测试

```
yarn smoke
```

### 打包

环境要求：已安装 Node.js（本项目在 Node 20 / Node 24 下验证通过）。依赖安装必须使用仓库自带的 Yarn 3（`.yarn/releases/yarn-3.5.1.cjs`），不要使用 `npm install`——`package-lock.json` 中存在残缺条目，npm 会报 `Invalid Version`。

安装依赖（Yarn 3 默认使用 PnP 模式，必须显式指定 `node_modules` 链接模式）：

PowerShell：

```powershell
$env:YARN_NODE_LINKER = "node-modules"
node .yarn/releases/yarn-3.5.1.cjs install
```

CMD（命令提示符）：

```bat
set YARN_NODE_LINKER=node-modules
node .yarn\releases\yarn-3.5.1.cjs install
```

国内网络建议先设置镜像（非必须）：

PowerShell：

```powershell
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"
$env:FFMPEG_BINARIES_URL = "https://npmmirror.com/mirrors/ffmpeg-static"
```

CMD（命令提示符）：

```bat
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
set FFMPEG_BINARIES_URL=https://npmmirror.com/mirrors/ffmpeg-static
```

打包：

PowerShell：

```powershell
# Windows：NSIS 安装包 + 免安装 zip
.\node_modules\.bin\electron-builder.cmd --win --publish never

# macOS
.\node_modules\.bin\electron-builder.cmd --mac --publish never

# Linux
.\node_modules\.bin\electron-builder.cmd --linux --publish never
```

CMD（命令提示符）：

```bat
:: Windows：NSIS 安装包 + 免安装 zip
node_modules\.bin\electron-builder.cmd --win --publish never

:: macOS
node_modules\.bin\electron-builder.cmd --mac --publish never

:: Linux
node_modules\.bin\electron-builder.cmd --linux --publish never
```

说明：`set` 只对当前 CMD 窗口生效，关闭窗口后失效；如需永久生效可用 `setx`（需重开窗口）。

Windows 下也可以直接双击运行仓库根目录的 `build-win.cmd`：脚本会自动设置环境变量、按需安装依赖并执行打包，完成后在 `dist/` 输出安装包。

产物位于 `dist/`：

- `M3U8-Downloader-win_x64-<version>.exe`：NSIS 安装包
- `M3U8-Downloader-win_x64-<version>.zip`：免安装压缩包
- `win-unpacked/`：解包后的程序目录，可直接运行调试

注意事项：

- 不要直接执行 `yarn pack-win` / `yarn pack-mac`：`package.json` 中这两个脚本带 `--publish always`，会尝试发布到 GitHub Release，需要配置 `GH_TOKEN`；使用 `--publish never` 只构建、不发布。
- 打包前请关闭正在从 `dist/win-unpacked` 运行的程序，否则 electron-builder 无法覆盖被占用的文件（`build-win.cmd` 会自动检测并提示）。
- 若构建报 `spawn UNKNOWN`（通常发生在生成 NSIS 卸载程序阶段），说明当前终端/沙箱限制了执行新生成的临时安装器，请在普通 PowerShell 窗口（非受限沙箱）中重试。
