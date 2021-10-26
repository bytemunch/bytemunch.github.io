# Dodgey Ball Devlog #1

## Multiplayer Game

Dodgey Ball is supposed to be a multiplayer game. So far we have player and ball. So we need player 2. And a game.

### The Multiplayer
Adding this was simple enough. Another player object in the scene, and let the players track their team. Give the second player a controler and done.

![two players!](img/blog/2-players.gif)

However after doing this and throwing a few balls, I noticed a couple things. Mainly that landing a shot is difficult, which is not ideal for the game's aim of being a quick bit of pick up and play fun.

![it's hard to aim](img/blog/hard-to-aim.gif)

This could be down to either the reticle not projecting in 3d correctly, or that the target and projectile are too small. Let's fix both of these things!

![bigger target easier game](img/blog/easy-throw.gif)

Much better.

### The Game
So here we have a multiplayer ball-throwing simulator. Let's add some game logic, starting with a scoreboard.

*and then I resized the window, realized my camera didn't scale correctly, and spent a couple hours rejigging the camera until it resized correctly again* but we don't talk about that.

### Scoreboard

First let's make a new camera *(please no)* for drawing without perspective and throw a box up on the canvas, making sure to give the UI elements a Z value of `Infinity` to allow for appropriate z-sorting.

![yes, box](img/blog/BOX.png)
>ah yes, box. refreshing to do something slightly useful after pissing about with that camera.

Track score, make a UI object for the canvas to display said score, project 'em with our XY camera, and edit the collision logic on players.

![scoreboard in action](img/blog/scoreboard.gif)

Ready to test the prototype! Getting an initial playtest done fast was important for me to gauge whether there's a point in continuing development.

![playtest](img/blog/playtest2.gif)

Helpfully it was fun to play! Though there are some new issues that have arisen, given that my opponent doesn't play games that use aiming and firing, she struggled to aim and shoot at the same time. My planned remedy for this will be for the player's last aim position to be kept if the stick returns to neutral. Also there seemed to be a couple collision issues when firing, which I think on watching the game back was due to the thrown ball colliding with a stationary ball on the floor. Or maybe it was a neutral throw.

But that's all tomorrow's problem now.

Blog done.
Bye.