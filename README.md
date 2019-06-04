# Introduction

This repo contains a collection of bots I built while playing [Screeps](https://screeps.com). They're all very incomplete or possibly broken, so if you're looking for something to load up and play with, I recommend looking elsewhere… :D

# Bots

* ## Asimov

  This bot got me to RCL3, but one of it's several bugs got my creeps killed overnight. The patented Spaghetti&trade;-framework proved too hairy to continue with, so Asimov was shelved indefinitely. Nevertheless, many parts of Asimov still live within it's successor~~s~~. \[F\]

* ## Babbage

  Babbage, initially a testbed for task-based control system, has less game features than it's predecessor, but it's a lot more efficient energy-wise. This is thanks to it's automatic creep renewal module, which makes creeps return to the spawn before their lifetime is up. The spawn in turn scans it's adjacent squares for creeps and renews them.

  A creep has 1500 ticks to live. The spawn can renew floor(600/body_size) ticks at the cost of ceil(creep_cost/2.5/body_size) energy... err.. which basically means this doesn't save energy at all, it just wastes CPU cycles :)

* ## Cailliau

  ![Sneak peek of task-based autonomic expansion to RCL2](https://raw.githubusercontent.com/thykka/screeps-bots/master/examples/screeps-bot-cailliau.mp4)
