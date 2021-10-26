# Dodgey Ball Devlog #2

## Resets and Win Scenarios

We left off after a successful initial playtest, with players throwing balls and getting score. But to start a new game, the whole page needed refreshing. And the game has no concept of winning or losing. We also saw some funny collisions, funky control issues, and I've realized that drawing object's front faces isn't ideal. Let's fix that.

### Front faces?
A 3D object projected in 2D space has depth, but we draw none of that depth, which on such a small playfield I figured wouldn't be an issue. The problem is that drawing the objects at their Z co-ordinate produces a projection at the front face of the object, wheras drawing at the center Z co-ord would possibly provide a better idea of the object's location in space.

from

`o.projectedScale = this.perspective / (this.perspective + o.z + this.camZ);`

to

`o.projectedScale = this.perspective / (this.perspective + o.z + this.camZ + o.depth / 2);`

So now we need to sort by the center Z of the objects rather than their front Z co-ord to get accurate layering.

![much easier targeting](img/blog/v-easy-throws.gif)

Yeah that feels better. But here we spot a bug where the live ball isn't being coloured red! Hmm.

### Ball Colour Bug

While I was fixing the ball colouring code I updated it so the ball reflects the colour of the team who threw it.

![colour is back](img/blog/colour-fix.gif)

### Game Resetting

Let's add a quick function to reset the game whenever we need. For now we'll reset when a team reaches 3 points.

![game resets after 3 points scored](img/blog/reset.gif)

Let's let the player decide their score limits, and give some feedback to show the match winner before continuing. I'll use HTML overlays for this, as it's less effort than another canvas UI object.

![menuing](img/blog/menuing.gif)

Of course further down the line this will be revamped to accept controller input, but it'll do for now.

### Match Timer

Next up is adding a time limit to games. Easy enough, find the [best way](https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95) to implement a second by second countdown and add a UIObject that displays the seconds left.

![timer implemented](img/blog/timer.gif)

### Ballsitting

In real-life dodgeball there's a rule to prevent a team holding all the balls and stalling the game, where if this happens for too long the opposing team gets ALL the balls. I think something similar would work here.

Five seconds of keeping all the balls, and they're given to your opponent. Nice! Just needs some sort of feedback for the player to understand what's going on.

![balls removed!](img/blog/ballswap.gif)

### Depth Perception

As it stands its not too easy to tell where something is on the Z axis easily. I'm not going to get into spot shadows below objects just yet, but I'll happily add a few lines crossing the playfield for now.

![lines on floor](img/blog/floorlines.gif)

### Simplifying Controls

To fix the useability issue around aiming and shooting, I'll use the left stick's direction to aim if the right stick is neutral. And while we're at it let's make shooting and pick-up context dependant.

### Playtesting

So me and my partner jumped in to another game with the updated control scheme. Simplifying the controls seems to have done the trick, as we were much more evenly matched this time around!

![another playtest](img/blog/playtest2-3.gif)

There was a bug where time ending would always declare a draw, but that was quick enough to squash.

As it stands stand the game is playable and hits the fast-paced silly fun metric that I intended. Good stuff. But it needs a few more features before it's ready for art or a nice UI. Let's get them out of the way.

### Ballswap Counter

First off we need some sort of feedback when the balls are swapped because of one player holding them all for too long.

For now I'll add a quick and dirty counter above the player that needs to throw next.

![throw counter displayed above player](img/blog/throw-counter.gif)

This adds a good bit of urgency, and hopefully makes the game feel more fair when your advantage gets flipped.


### Countdown

The game starts as soon as you press play, which gives no build-up or room to prepare for the match. A simple 3 second countdown before the match should fix this.

![countdown before the match](img/blog/countdown.gif)

Sweet.

With that I think mechanically the game is where I want it. Next stop, UI/UX.