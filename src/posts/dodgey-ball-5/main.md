# Dodgey Ball Devlog #5

## Controller Selection
So if you've been reading along you may have noticed I've implemented full-screen touchscreen controls for one player, in a multiplayer game. Why? Online play. But before we get into all that I need to get the controller select screen working, doing controller detection and such on the way. In future I intend to allow 4-player couch play, but I'll keep working with only 2 for now for simplicity's sake.

### A new Custom Element

To get the behaviour I want I'll again be making use of a custom element.

![controller selection screen](img/control-select.gif)

Yup, that's what I'm looking for! Now to let the player objects pull from these elements' states, and that's controller selection functioning. Though in practise one player selecting all the control schemes is a bit clunky. I'm thinking that setting touch or keyboard controls should be done manually, while controllers auto-assign to their players and then go to team/character selection after. Or maybe make team/character/controller selection one screen? Market research time! What's everyone else doing?

![image of notes 1](img/notes-research.jpg)

After looking at a few other games' controller setup screens, I have a better idea of what I want mine to be. Controllers should populate the next available player slot when the primary face button is pressed and free it up with the secondary face button. The same screen and element will be used to select a profile or character when it's populated, and all controllers but player 1's will be locked into their elements. I'll add a new screen after controller setup for team setup, à la FIFA, as keeping the two seperated will be better for adding online play later, where all players will be locked to one team. Team setup will also be where desicions about AI players will be made. Keyboard and touch controls will be selectable by clicking or tapping the join elements, and players should be colour coded.

Well that's a lot of words. Time for some actual coding to get it all up and running!

![controller joining and player character selection](img/controller-setup-4player.gif)

Needs some touchup work on the CSS side and some button prompts, but this screen's looking good functionally. I'll need to make (or pinch) a manifest of friendlier controller names to limit the space required to display controller types too, as names like `Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)` and `Xbox 360 Controller (XInput STANDARD GAMEPAD)` aren't the nicest to look at.

![friendly controller names](img/controllers-friendly.png)

Fab. I'm glad to be moving on from that screen, not had much time to focus on the project recently so it's been a long time tweaking bits and bobs here and there. Very ready to move on to something less design-oriented!

Done for now. Cya.