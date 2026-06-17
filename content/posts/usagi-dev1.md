---
title: "Usagi Series: Build your first game"
date: 2026-06-01
desc: Learn the fundamentals of building a game and the usagi engine
---

I have been building games since I was 16. I have always wanted to be a game developer professionally and it hasn't really happened yet for me. However, I still occasionally just make a little game or do a game jam for fun every once in a while. 

Well, [Brett Chalupa](https://brettchalupa.com/) recently debuted the Usagi engine 1.0 and is hosting a [game jam](https://itch.io/jam/usagi-jam-2026) next month. This kinda thing gets me going and so I thought I would give back by contributing a tutorial on how to make your first game using Usagi. These kind of tutorials really helped me learn game development as a 16 year old kid with those early versions of Unity. As such, this tutorial is intended for someone who has never programmed a game before. I will expect you to have some programming knowledge (how to open a text editor, install things, navigate shell commands) but you will get by with not having any prior knowledge of `lua`, which is the language we will use to interface with the Usagi engine. 

So, today we're going to start building a version of the classic game _Asteroids_

## Getting Started

I am working on a Macbook but you can complete everything here on any platform. The Usagi engine can be installed via normal package managers (`brew` for instance), by downloading the installer from their Github, or by building yourself (written in Rust). 

[Usagi Github](https://github.com/brettchalupa/usagi)

I also recommend installing [Aseprite](https://www.aseprite.org/) as that's what I'll be using for art for the purposes of this tutorial.

Once installed, create a directory for our game and run the command to create a new Usagi project.

```bash
mkdir demo-game
cd demo-game
usagi init
```

Another thing you will need to ensure you have is a text editor with language server support for Lua. I use nvim and so that process consists of installing and configuring `lua_ls`. You can see this [here](https://github.com/BenHeil26/nvim/blob/33324a73d83c33424942d2cbdc406dd9f6e2ff25/lua/bheil/plugins/lsp.lua#L182) in my nvim dotfiles. For something like VSCode, this is as simple as installing an extension for Lua from the marketplace.

The language server support is crucial so that we get things like auto-complete, syntax highlighting, and real time feedback for the code we are writing. 

## Overview 

Once you run `init` you are going to get a few artifacts that are explained below:

```
/demo-game
├── main.lua        # The entrypoint for our game
├── USAGI.md        # Core documentation for the engine, same file is available online
├── .gitignore      # tells git what not to track
├── .luarc.json     # drives lua interpreter and language server settings
└── /meta
    └── usagi.lua   # Creates all the code bindings for the usagi engine
```

At this point, it would be best to open up `main.lua`, and name your game. The first thing you should see in that file is a `_config()` function that returns a table containing metadata about our game. 

Make the following changes:
```lua
function _config()
  return { name = "Demo Game", game_id = "com.usagiengine.demo-game" }
end
```

## What is a game engine

Okay so now you are probably wondering how this actually works. What kind of code actually makes up a game?

At its core, a video game is really just a loop that runs that is constantly painting and repainting graphics to the screen. There is logic within the game's engine that responds to the user input, the current state of the game, and potentially data from a server (in the case of online games) to decide what to paint and where. The job of a game engine is to provide abstractions for the "game loop" as well as other common tasks that are tedious to implement (reading input, doing physics calculations, slicing up sprite sheets for graphics, etc). 

Usagi is a very minimal game engine but in my opinion it provides a very good balance of simplicity while still providing abstractions for the difficult things to implement that aren't necessary "game logic" as well as some nice "ergonomics" that make the developer experience nice. 

Speaking of simplicity, we only have four life-cycle hooks (i.e. places where we can inject code) for the entire game engine! You may think this is a tight constraint, but I will show you how to properly leverage that constraint to our advantage in later editions of the tutorial. 

## Developing a toy

For now, let's get something going. We're not going to make a game just yet, but let's build a toy. Let's launch in dev mode and start painting stuff to the screen. 

Run the following to launch our game in dev mode, in dev mode our game will "Live reload". That is, it will respond to code that we write as it's saved, and update the game without us having to relaunch anything.

```bash
usagi dev
```

Alright so you should see a window pop up with some text on it. Doesn't look like a game yet but there is a game loop running and all the foundational parts are there, they're just painting static text over and over again. Don't believe me? Try pressing [esc] or `~` and see what happens. 

So let's draw something of our own, in `main.lua` go ahead and find the `_draw(dt)` function. Notice that it takes in a parameter `dt`. For now don't worry about that but we will come back to it soon.

```lua
function _draw(dt)
  gfx.clear(gfx.COLOR_BLACK)
  gfx.text("Hello, Usagi!", 10, 10, gfx.COLOR_WHITE)
end
```

You should have something similar to the above. If so, go ahead and delete the `gfx.text` line.

Let's change this to the following code:

```lua
function _draw(dt)
  gfx.clear(gfx.COLOR_BLACK)
  gfx.rect(10, 10, 10, 10, gfx.COLOR_PINK)
end
```

Here, we've drawn a 10 x 10 pixel rectangle at screen coordinates {10, 10} in the PINK color from the default color palette. 

Okay great, now let's make it do something. Let's start by defining a variable for the position of our rectangle. Then let's add 1 to both the `x` and `y` components of our position each time `_draw()` is called.

You are going to get some warnings for doing it this way but ignore them for now.

```lua
position = {
  x = 10,
  y = 10,
}

function _draw(dt)
  gfx.clear(gfx.COLOR_BLACK)
  gfx.rect(position.x, position.y, 10, 10, gfx.COLOR_PINK)
  position.x += 1
  position.y += 1
end
```

Now, close your existing instance of Usagi and run `usagi dev` again. What you will likely see is a pink square fall off the screen pretty quickly. However, when you restart the game with ctrl+r of through the pause menu, you'll notice the square does not return to its starting position. That's because we used a globally scoped variable to store the position data. You see, when Usagi restarts, it does so by resetting the `State` object via running `_init()` again.

Said another way, `_init()` runs once when our game starts up and is responsible for initializing our state. Now, let's update `_init()` to include our position data and update our `_draw()` function to leverage it.

```lua
function _init()
  State = {
    position = {
      x = 10,
      y = 10,
    }
  }
end

-- ...

function _draw(dt)
  gfx.clear(gfx.COLOR_BLACK)
  gfx.rect(State.position.x, State.position.y, 10, 10, gfx.COLOR_PINK)
  State.position.x += 1
  State.position.y += 1
end
```

Okay great, now that square is resetting each time.

## Taking control

Alright so now we're moving a square but it would be cool if we could actually tell our toy how we want to do that. So let's take some input from the user. Taking input in Usagi is pretty straightforward with some caveats I'll try to point out. 

First, let's talk about our life-cycle hooks again. So far, we've interacted with `_config()`, `_init()`, and `_draw()`. Let's quickly cover `_update()`. `_update()` is where our "game logic" and "physics engine" ought to live. Essentially, anything that happens in our game loop OUTSIDE of graphics happens in our `_update()` code. The reason for this has to do with how often each hook runs and assumptions we make in our code involving that frequency. If that doesn't make sense that's okay - just know this, `_update()` can run many time per each `_draw()`. Essentially `_update()` is going to execute as many times as your processor can execute it, while `_draw()` will TRY to execute on a fixed interval like 60 times-per-second (or Hz). It's really important that we do the least amount possible in our `_draw()` loop so that interval is not disrupted. If you've ever played a video game that is choppy, laggy, or "unoptimized", then you will understand why.

That leads me to the final concept I will introduce at this stage, "delta time". Delta time is the amount of seconds between executions of our loops, both `_update()` and `_draw()`. Btw, there is a common name for an execution of each of these loops. Let's use those names for the rest of the tutorial. From now on, I will refer to an execution of an `_update()` as "tick", and an execution of `_draw()` as "frame". Hopefully that makes sense to you intuitively, but if not try to remember which one is which. 

Back to delta time and why it's important. We are often going to need to incrementally change a value each tick or frame. In order for this change to "feel" smooth to the user, it's important that we account for the delta time between each tick or frame. If you haven't figured it out already, that is what the `dt` parameter in both the `_update()` and `_draw()` function is for. `dt` is the delta time between ticks/frames.

Whenever we do anything in our loops that involves incrementally changing a value, we should be careful to include `dt` in the calculation (usually just by multiplying by it) in order to "smooth" the change we are making.

Now that you've got all that, let's add some movement to our square whenever the user presses WASD or the arrow keys. Usagi makes this pretty easy with the following.

```lua
function _init()
  State = {
    position = {
      x = 10,
      y = 10,
    },
    speed = 100
  }
end

function _update(dt)
  if input.held(input.DOWN) then
    State.position.y += State.speed * dt
  end
  if input.held(input.UP) then
    State.position.y -= State.speed * dt
  end
  if input.held(input.RIGHT) then
    State.position.x += State.speed * dt
  end
  if input.held(input.LEFT) then
    State.position.x -= State.speed * dt
  end
end

function _draw(dt)
  gfx.clear(gfx.COLOR_BLACK)
  gfx.rect(State.position.x, State.position.y, 10, 10, gfx.COLOR_PINK)
end
```

The code above, enables our square to move around when we give it input. I'm not going to cover the extent of the `input` API quite yet, but feel free to experiment with this and see what other features exist. Notice also that I multiplied our speed variable by the `dt` argument. Try and do this without that and with different values of speed.

Now, this code still has one problem, can you spot it?

.
.
.

If you found that vertical and horizontal movement was _slower_ that diagonal movement then you nailed it. Now why is that? We are increasing our position in any given direction by the same amount. Except, when we move diagonally, we are actually moving in two directions at once (both x and y by the same speed). So the resultant _vector_ for our movement is actually the square root of the speed in each direction squared (i.e. Pythagorean theorem). So, in order to account for that, we need to normalize our vector so that the rate of movement in any of the 8 possible directions is always our `speed` value. Thankfully Usagi gives us a nice function from the `util` API to accomplish this.

First, we'll create a vector for our input, so that we know which direction we should be going. Since lua does not have an easy way to coerce a bool to an int (like C for example) I will create a quick helper function to do so.

```lua
function bool_to_int(bool)
  return bool and 1 or 0;
end

function _update(dt)
  local input_vec = {
    x = bool_to_int(input.held(input.RIGHT)) -
        bool_to_int(input.held(input.LEFT)),
    y = bool_to_int(input.held(input.DOWN)) -
        bool_to_int(input.held(input.UP))
  }
  --...
end
```

Now that we know which direction we are trying to go, let's normalize that vector. Normalizing means creating another vector that points in the same direction of our current vector, but with an absolute magnitude of 1. So essentially a normalize function will produce a vector with x and y components that make a vector of magnitude one but have the same angle. It's a bit of trigonometry to implement, which thankfully Usagi will do for us. See the code below:

```lua
  local normal = util.vec_normalize(input_vec);
```

Finally, we need to put it all together and change our position based on all the parameters we've now calculated:

```lua
  State.position.x = (State.position.x + normal.x * State.speed * dt)
  State.position.y = (State.position.y + normal.y * State.speed * dt)
```

## Summary 

Cool, so in this tutorial we covered quite a lot about the basics of video game programming and Usagi. 
I'll briefly summarize below:
* Games are just loops that paint graphics to a screen based on input, state, and outside conditions like network input.

* Usagi gives us four life-cycle hooks. 
    * `_config()` and `_init()` help us start our game up and drive initial state
    * `_update(dt)` executes each 'tick' and is for our game's logic and calculations, physics, and everything else that isn't graphics
    * `_draw(dt)` executes each 'frame' is where we draw our graphics
* `dt` or delta time is the time between each frame or tick depending on the hook
* To build "fair" 8-directional input we need to use normal vectors
* We now have a fully functioning toy that let's us move a box around on the screen

Next time, we'll work on making a ship for our _Asteroids_ game and start implementing some of the mechanics that take this from toy to game. 


