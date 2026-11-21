# 上线观众量预测 / Launch Tide

[中文](#中文) · [English](#english)

## 中文

### 第一次使用

安装 [Node.js 的 LTS 长期支持版](https://nodejs.org/en/download)（22.18 或更新）。

1. 在仓库页面点 **Code → Download ZIP**，下载并解压。打开解压后含有 `main.ts` 的文件夹。
2. 在 Windows 文件资源管理器地址栏输入 `powershell` 后按回车。把下面的命令复制到打开的窗口并回车。

```powershell
$env:MAKEFUN_INPUT_DIR = 'examples'
$env:MAKEFUN_OUTPUT_DIR = 'out'
node main.ts
```

用记事本或任意文本编辑器打开 `out/demo.out`。里面是模拟游戏发布后第 2、3 小时的观众分位数。

用历史游戏发布曲线和首小时观测预测接下来各小时的观众量分位数。

### 本地运行

使用 Node.js 22.18 或更新版本。设置 `MAKEFUN_INPUT_DIR`（存放赛事 `.in` 文件）和 `MAKEFUN_OUTPUT_DIR`，然后运行 `node main.ts`。

PowerShell 示例（使用模拟数据）

```powershell
$env:MAKEFUN_INPUT_DIR = "examples"
$env:MAKEFUN_OUTPUT_DIR = "out"
node main.ts
```

结果写入 `out/demo.out`。

## English

### First use

Install the [Node.js LTS release](https://nodejs.org/en/download), version 22.18 or newer.

1. Choose **Code → Download ZIP**, extract it, then open the extracted project folder.
2. On Windows, type `powershell` in the File Explorer address bar and press Enter. Run the commands below.

```powershell
$env:MAKEFUN_INPUT_DIR = 'examples'
$env:MAKEFUN_OUTPUT_DIR = 'out'
node main.ts
```

用记事本或任意文本编辑器打开 `out/demo.out`。里面是模拟游戏发布后第 2、3 小时的观众分位数。 macOS or Linux users can use the shell example further down.

A quantile forecaster for launch-day audiences using historical launch curves and the first observed hour.

### Run locally

Use Node.js 22.18 or newer. Set `MAKEFUN_INPUT_DIR` to the challenge’s `.in` files and `MAKEFUN_OUTPUT_DIR` to a writable directory, then run `node main.ts`.

Run the synthetic example on macOS or Linux.

```sh
MAKEFUN_INPUT_DIR=examples MAKEFUN_OUTPUT_DIR=out node main.ts
```

The output is written to `out/demo.out`. See the Chinese section for the equivalent PowerShell commands.

[中文技术说明](README.details.zh.md) · [English technical notes](README.details.md)

[make.fun 赛事 / Original bounty](https://make.fun/bounty/gta6-twitch-ccu-forecast-01)

## 许可证 / License

MIT. See [LICENSE](LICENSE).

