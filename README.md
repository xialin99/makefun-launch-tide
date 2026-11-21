# Launch Tide

[中文](#中文) · [English](#english)

## 中文

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

