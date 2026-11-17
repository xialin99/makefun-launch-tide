# Launch Tide: adaptive audience forecasts

This Node.js program predicts five quantiles for hours 2–24 of a game's launch day, conditioned on the first observed hour and the supplied historical release curves.

## Forecast method

The model compares pre-launch audience ratios, launch audience scale, platform mix, rolling unlocks and early-access metadata. It excludes the target-history record from the training launches. Neighbor count and metadata weight are selected using leave-one-launch-out pinball loss across the historical comparables included in the input. The final prediction retains a small weight on the full historical population.

No practice answer file or future target observation is used. Historical validation is a development diagnostic, not evidence of future accuracy or a prize.

## Execution

Use Node.js 22.18 or later. Set MAKEFUN_INPUT_DIR to the directory containing the supplied .in cases and MAKEFUN_OUTPUT_DIR to an empty output directory, then execute `node main.ts`. Each case produces a matching .out JSON file. Runtime uses only Node's standard library and makes no network calls.

## Validation and status

All four supplied case outputs pass structural checks: 23 ordered hours, five finite positive nondecreasing quantiles per hour, and values within the contest cap. Leave-one-launch-out loss on the 37 supplied historical launches is approximately 0.266; an unconditional historical comparison is approximately 0.340. The earlier platform submission had practice loss 0.284185. This adaptive version has not yet received a platform score.

This is experimental competition software. No reward has been received. The source is MIT licensed; see LICENSE. Private keys, access credentials, transcript archives and generated forecasts do not belong in this repository.
