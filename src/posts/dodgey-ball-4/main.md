# Dodgey Ball Devlog #4

## Control Methods

The plan today is to add two new control methods, starting with Keyboard/Mouse and moving on to a touchscreen overlay.

### Keyboard and Mouse
Adding Keyboard support should be simple. I'm going to look in to creating a virtual controller for each player and abstracting the actual used control method away, allowing for easier expansion. This implementation should leave space for remapping.

After creating a class to hold all possible player actions and take inputs, I've found that the method for aiming on a keyboard is going to require some thought. As I feel aiming by mouse position would be too overpowered compared to controller input, I'll rotate the target vector around the player based on button presses. This should be easy enough to implement with `gl-matrix`.

```ts
if (kb['Q']) { vec3.rotateY(target, target, [0, 0, 0], -0.1) };
if (kb['E']) { vec3.rotateY(target, target, [0, 0, 0], 0.1) };
```

Super easy! So glad I didn't have to do the math myself.

I also added direct targeting with the numpad. I don't expect many keyboard controller players *(I don't expect many players at all)* but at least the option's there. In future I'd like to imporove the code by having the target move to the defined vector over time, but I don't see that as priority for now.

### Touchscreen

This will be an interesting one. It seems like a common enough input method that there would be readily available code for touchscreen thumbsticks...

Yup, here's a cool [fiddle](https://jsfiddle.net/aa0et7tr/5/) from [/u/AndrewGreenh](https://www.reddit.com/user/AndrewGreenh) that I can co-opt into the game.

![touch controls](img/blog/touchscreen-controls.gif)

That's working nicely, but I have a sneaking suspicion that multitouch is gonna bust this implementation up. I'll load it up on the phone and find out.

![touch controls, no multitouch](img/blog/touchscreen-no-multi.gif)

Oof, yup. Plenty to fix up here. We need to somehow prevent pinch-zoom, and filter the touch events to make sure they're for the respective joystick.

Usability-wise I think that on mobile the ball should shoot in the aimed direction on release of the stick, as button pressing on a touchscreen is a terrible experience whichever way you slice it.

![sticky sticks](img/blog/sticky-sticks.gif)

Attempt 1 lead to sticky sticks.

![unsticky sticks](img/blog/unsticky-sticks.gif)

But expanding the zone I was doing the collision check in fixed it! Now to take a look at the zoom issue.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

Honestly SPA games on the web and accessibility just do not mix. I'll add some text-sizing stuff to help with visibility later on.

