
[![video](resource/1.png)](https://github.com/12343954/M3U8-Downloader/assets/1804003/94a9a2fa-6727-47e2-8949-5a337963556b)

<img src="resource/1.png" alt="M3U8-Downloader" />

<img src="resource/2.png" alt="M3U8-Downloader" />

<br/>
<br/>

# M3U8-Downloader

An app developed based on the Electron framework that can download and play HLS video streams.

<br/>
<br/>

<table>
<tr>
<td>Module</td>
<td>Features</td>
</tr>
<tr>
<td>Downloader</td>
<td>
<ol>
<li>Download `m3u8` url</li>
<li>Auto-recognizes the clipboard</li>
<li>Batch downloads</li>
<li>Video category</li>
<li>Merge TS fragments manually</li>
<li>Custom http-header parameters</li>
<li>Multiple language support</li>
<li>Dark theme, protect eyes</li>
<li>Free and open source, no ads</li>
<li>No tracking, no backdoors</li>
<li>Multi-platform support, macOS, Win10+, Linux</li>
</ol>
</td>
</tr>
<tr>
<td>Player</td>
<td>
<ol>
<li>Rotate the video screen</li>
<li>Play other local meida files</li>
<li>pin-on-top window</li>
</ol>
</td>
</tr>
</table>

<br/>
<br/>


---
<br/>
<br/>

## How to get `.M3U8` url

In chrome browser, press F12, click the tab to the `Network` page, enter "m3u8" in the Filter box, and then press F5 to refresh the page, if the video in the web page uses an HLS source, you can capture the video stream address here, and then right-click Copy -> Copy Link Address.
Provide the m3u8 source address, download and transcode Mp4 files losslessly
<br/>
<br/>
## Download [Releases](https://github.com/12343954/M3U8-Downloader/releases) 
<br/>
<br/>

## Development environment

```
- node -v   v20.4.0
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

### Clone code

```
git clone https://github.com/12343954/M3U8-Downloader.git
```
### Install Yarn

```
npm install yarn -g
```

### Upgrade to yarn 3.5.1
```
yarn set version stable
```

### Install dependencies

```
yarn
```



### Run

```
yarn start
```
### Package

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
```

CMD（命令提示符）：

```bat
:: Windows：NSIS 安装包 + 免安装 zip
node_modules\.bin\electron-builder.cmd --win --publish never

:: macOS
node_modules\.bin\electron-builder.cmd --mac --publish never
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

### Enjoy it


