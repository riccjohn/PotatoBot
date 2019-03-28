# To Do

## Commands to implement

### Roll

- [x] `!r 1d20`
- [x] `!r 1d20 + 2`
- [x] `!r 1d20 + 2 #Perception`
- [x] `!r 2d20 + 2 -advantage` / -a / -adv
- [x] `!r 2d20 + 2 -disadvantage` / -d / -dis
- [ ] `!r 3d6 -kh2 #Con` => Keep highest 2
- [ ] `!r 3d6 -dl1` => drop lowest 1
- [x] `!r 1d8 + 4d6`
- [ ] Make roll result more prominent!
- [ ] Move comment to front of response
- [ ] Add 'crit!' to response when appropriate

#### Advantage / disadvantage

- Right now it's set up as it's own command. I should actually code something for `!r 3d6 -k2` (roll 3d6 and keep the highest 2), and then have `-adv` and -`dis` just be shorthand for `-k1` with a check to make sure there's only 2 dice being rolled.

- When we show the results, right now we only show the higher or lower roll depending on if it was with advantage or disadvantage. Ideally it should show something like the below:
  - @PotatoBeard:`2d20` => (`~~2~~`, 18) = 18
    - (~~ will show as a strikethrough in Discord)
