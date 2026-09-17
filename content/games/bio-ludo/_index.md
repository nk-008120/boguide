---
title: "BiOLudo"
description: "A biology-trivia Ludo variant: character classes with kill ranges, a moving Unsafe Zone, and combat settled by quiz duels."
---

A tribute to a childhood Ludo variant, rebuilt with biology trivia deciding every
fight. Four character classes, dice-chaining, a moving Unsafe Zone, and every
kill settled by how well you know your biology, not just the dice.

{{< bio-ludo-game >}}

## The rules

### Setup

Choose a mode: local pass-and-play for 2 to 4 human teams sharing one screen, or
1 human vs. 3 bots. In bot mode you pick a shared difficulty (easy, medium, or
hard) for all three bots; that sets their odds of answering any given question
correctly.

Before the board appears, every team answers the same style of 10-question quiz
(bots answer instantly, at their difficulty's odds). Each team's correct count
becomes lottery tickets (correct answers plus one) toward becoming the **Safe
Team** for the match, decided by one weighted random draw. A team with zero
correct answers still has a small chance; a team with a perfect score has the
best odds, not a guarantee.

### Characters and classes

Each team fields four characters, one of each class:

- **Sniper** (S): kills at range 5-6 blocks.
- **Assaulter** (A): kills at range 3-4 blocks.
- **Trooper** (T): kills at range 1-2 blocks.
- **Hand Combat** (H): melee only, must land exactly on the enemy's square.

All four start in your yard. A roll of 1 or 6 releases one character onto the
board.

### Dice and movement

Roll the die. Rolling a 6 lets you roll again, and you keep every number from
the chain to spend this turn, split across your team's characters however you
like, one number per move; a single roll can never be split between two
characters. Move any of your active characters forward or backward along the
track (rolling a 1 or 6 can also release a new character instead of moving one
already on the board). You must use every number you rolled if a legal move
exists for it; if none of your active or yard characters can use a given
number, it's discarded automatically.

### Safe squares

Two squares per team are permanently safe: each team's own home entry square,
and a second square 5 blocks away in the other lane of that team's home
region (marked with a star on the board). A character standing on a safe
square cannot be attacked, no matter whose turn it is or what range the
attacker has.

### Combat

Moving a character within killing range of an enemy (or releasing one directly
into range) triggers a duel, unless the defender is on a safe square. If more
than one enemy is in range, you choose the target.

- **Same class vs. same class:** both sides answer the same 3 questions. In
  local play this is self-reported (an honor system, same as the rest of the
  site's practice questions); against a bot, the bot's score is rolled
  instantly at its difficulty's odds while you answer for real. Whoever
  answers more correctly knocks the other out; a tie means both survive.
- **Different classes:** only the attacker answers 3 questions. Their correct
  count sets a kill chance for the defender: 0 correct = 25%, 1 = 50%,
  2 = 75%, 3 = 95%. The attacker is never at risk in this kind of duel.

### Knockout and revival

A knocked-out character doesn't go back to the yard. It stays right where it
fell, visibly grayed out, until its own team's next turn ends. Any teammate
within 1 block during that window can attempt a revival: another 3-question
duel (same odds table as cross-class combat) decides it. Succeed and the
character rejoins the fight exactly where it was knocked out, no dice spent.
Fail, or let the window close with no attempt, and the character is gone for
the rest of the match, permanently, not sent back to the yard.

### The Unsafe Zone

Once every team has completed one full round, two Unsafe Zone flagbearers
wake up. They start together at the center and walk down the home path of
the team **opposite** the Safe Team, one block per round, taking six rounds
to reach the shared track.

Once on the board, they split and walk in opposite directions around the
track at the same pace, always symmetric: 1 block per round for 5 rounds,
then 2 blocks per round until they each reach the nearest lateral team's
corner, then 1 block per round for the rest of the way, converging on the
Safe Team's own zone. Once they arrive, the journey ends there for the rest
of the match.

The stretch of track they've already swept through, behind them on the side
they started from, is the **dead zone**: any character that stays there for
a full turn dies, permanently, no revival possible. The dead zone grows as
the flagbearers advance and disappears completely once they reach the Safe
Zone.

If a team still has all four characters sitting untouched in its yard by the
time a flagbearer's sweep passes that team's home square, that team's
characters are eliminated on the spot.

### Winning

First team to bring all four characters all the way home wins outright. If
every other team is wiped out (every character permanently dead) before that
happens, the last team standing wins instead.
