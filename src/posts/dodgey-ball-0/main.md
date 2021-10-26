# Dodgey Ball Devlog #0

So here I am. Starting a devlog partway through a project.

## The Project
Intention is to make a fun fast-paced multiplayer game, akin to [Sports Heads](https://www.mousebreaker.com/game/sports-heads-football-championship) and games of that ilk. Except it's based on dodgeball rules, and played in 3D space.

## So far...
### GameObject
Let's make a box! With the physics variables from the wonderful [Nature of Code](https://natureofcode.com/), I made the base class for everything in-game to inherit from...

### Sphere
... and immediately wrote a class that overrides most of that base class. But now we have round. And it's all in 3D, not that I can render that yet.


### The third dimension
I used to write my own vector functions but thought that it'd be wasteful rewriting them all for another dimension. Enter [gl-matrix](https://glmatrix.net/), with more functionality than I need right now, but the capabilities it seems to have should be useful later down the line.

So there's a 3D vector library. But how on earth do I show 3D space on a 2D canvas? God I hope I don't need to think with cameras...

### Thinking with cameras
Quick google search. [Pretty example.](https://www.mamboleoo.be/articles/how-to-render-3d-in-2d-canvas) Checking the code... Okay yeah we're doing projection, let's make that camera.

Initially I made a Camera object per GameObject. Which worked, but in hindsight wasn't the simplest. After moving the Camera out to the main Game class things started flowing. Stuff was being projected into a space correctly! Add a sprinkle of z-sorting and there it is, '3D'.

### A player approaches...
So we have 3D balls and boxes. Done, ship it, game's mint.

Nah. We need a player, and my intention is to have them controlled by a gamepad. Hope that API is easy. Google, MDN, aaaaand [yeah](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) it's easy enough! Throw the controller axis variables at the Player's force vectors and... Nope. Swap the Y and Z though, and we can move about on our 3D floor. Wew.

Target reticle, throw ball button, pickup ball button, sprint button, all easy enough!

And now add some collision and...

![awful collision](img/blog/yeet-collision.gif)

and...

![sticky collision](img/blog/sticky-collision.gif)

AND...

![ok collision](img/blog/ok-collision.gif)

Ok. We can work with that.

So yeah that's where I'm at. Cya.