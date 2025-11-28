---------------------------------------------
Coding assignment for SpinPlay Games

Author: Martin Burke, November 2025
---------------------------------------------

I started this project from scratch, using "npm create pixi.js@latest" to get set up with a asic Pixi.js app using. The app is written in TypeScript using Pixi v8 and is bundled with webpack. To play the game run 'npm run dev', which will build the app and serve it on a local server at http://localhost:5143/

Some supporting libraries I used include, GSAP for tweening, Howler for audio, Eventemitter3 for event handling, and @pixi/particle-emitter for the particles engine (although I had to use a branched verison of this as the official version doesn't yet support Pixi 8!)

I've added the ability to force results in the app. If you press the number keys 0 - 8 before spinning the wheel, it will force that index from the weighted table. So 0 -> 5000, 1 -> 200, 3 -> 1000, etc.. Forcing 5000 (by pressing 0) will force a "big" win, which will show the coin shower animation. 

I went with a rough MVC design pattern to keep the project somewhat structured sensibly. It was a little a bit rushed I'm afraid and I'm sure there is plenty of room for tidying up and optimisation, but I hope I have taken it far enough to demonstrate my proficiency with Pixi. I've added some comments where I felt they might be helpful and also in parts where I could have taken things further, but decided it'd probably be better to leave for discussion afterwards. I would be happy to answer any quetions you might have, just let me know. 
